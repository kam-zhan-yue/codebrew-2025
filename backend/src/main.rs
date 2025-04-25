mod game;

use std::sync::Arc;

use game::{Game, UpdatePayload};
use rocket::tokio;
use rocket::tokio::time::{interval, Duration};
use rocket::{
    futures::{lock::Mutex, SinkExt, StreamExt},
    http::Method,
    State,
};
use ws::{self, Message};

use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};

#[macro_use]
extern crate rocket;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let allowed_origins = AllowedOrigins::some_exact(&[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://0.0.0.0:8000",
        "https://codebrew-2025-frontend.onrender.com/",
    ]);
    // add deployed frontend URL later

    let cors = CorsOptions {
        allowed_origins,
        allowed_methods: vec![
            Method::Get,
            Method::Post,
            Method::Put,
            Method::Delete,
            Method::Options,
        ]
        .into_iter()
        .map(From::from)
        .collect(),
        allowed_headers: AllowedHeaders::all(), // Allow all headers
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .expect("CORS fairing creation failed");

    let game_state = Arc::new(Mutex::new(Game::default()));

    // Creates an index route, mounts the route at / and launches the app
    let r = rocket::build()
        .mount("/", routes![game_stream])
        .attach(cors)
        .manage(Arc::clone(&game_state));

    let game_state_ref = Arc::clone(&game_state);

    // Game loop thread
    // Updates 120 times/sec
    tokio::spawn(async move {
        let tick_duration = Duration::from_secs_f64(1_f64 / game::TICKS_PER_SECOND);
        let mut tick_interval = interval(tick_duration);

        loop {
            // block for game state updates so lock drops afterwards
            {
                let mut thread_game_state = game_state_ref.lock().await;
                thread_game_state.update();
            }

            tick_interval.tick().await;
        }
    });

    r.launch().await?;

    Ok(())
}

#[get("/game_state")]
fn game_stream<'r>(ws: ws::WebSocket, state: &'r State<Arc<Mutex<Game>>>) -> ws::Channel<'r> {
    ws.channel(move |mut stream| {
        Box::pin(async move {
            let tick_duration = Duration::from_secs_f64(1_f64 / game::TICKS_PER_SECOND);
            let mut tick_interval = interval(tick_duration);
            let state_ref = state.inner().clone();

            tokio::spawn(async move {
                loop {
                    tokio::select! {
                        _ = tick_interval.tick() => {
                            let game_state = state_ref.lock().await;
                            let _ = stream
                                .send(ws::Message::text(
                                    serde_json::to_string(&game_state.clone()).unwrap(),
                                ))
                                .await;
                        }
                        Some(Ok(message)) = stream.next() => {
                            match message {
                                Message::Text(text) => {
                                    let mut game_state = state_ref.lock().await;
                                    let payload: UpdatePayload =
                                        serde_json::from_str(text.as_str()).unwrap();
                                    game_state.client_update(payload);
                                }
                                Message::Close(_) => {
                                    let close_frame = ws::frame::CloseFrame {
                                        code: ws::frame::CloseCode::Normal,
                                        reason: "Client disconected".to_string().into(),
                                    };
                                    let _ = stream.close(Some(close_frame)).await;
                                    break;
                                }
                                _ => {}
                            }
                        }
                        else => {
                            let close_frame = ws::frame::CloseFrame {
                                code: ws::frame::CloseCode::Normal,
                                reason: "Client disconected".to_string().into(),
                            };
                            let _ = stream.close(Some(close_frame)).await;
                            break;
                        }
                    }
                }
            });

            Ok(())
        })
    })
}
