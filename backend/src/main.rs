mod game;

use std::sync::{Arc, Mutex};
use std::thread;
use std::thread::sleep;
use std::time::{Duration, SystemTime};

use game::Game;
use rocket::{
    futures::{stream::FusedStream, SinkExt},
    http::Method,
    State,
};
use ws;

use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};

#[macro_use]
extern crate rocket;

const TICKS_PER_SECOND: f64 = 1_f64;

#[launch]
fn rocket() -> _ {
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
    let game_state_ref = Arc::clone(&game_state);

    // Game loop thread
    // Updates 120 times/sec
    thread::spawn(move || {
        let tick_duration = Duration::from_secs_f64(1_f64 / TICKS_PER_SECOND);
        let mut last_update_time = SystemTime::now();

        loop {
            // block for game state updates so lock drops afterwards
            {
                let mut thread_game_state = game_state_ref.lock().unwrap();
                thread_game_state.update();
            }

            let now = SystemTime::now();
            let duration = now.duration_since(last_update_time).unwrap();

            if duration < tick_duration {
                let diff = tick_duration.abs_diff(duration);
                sleep(diff);
            }

            last_update_time = SystemTime::now();
        }
    });

    // Creates an index route, mounts the route at / and launches the app
    rocket::build()
        .mount("/", routes![index, hello, game_stream])
        .attach(cors)
        .manage(game_state)
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/hello/<name>")]
fn hello(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[get("/game_state")]
fn game_stream<'r>(ws: ws::WebSocket, state: &'r State<Arc<Mutex<Game>>>) -> ws::Channel<'r> {
    ws.channel(move |mut stream| {
        Box::pin(async move {
            let tick_duration = Duration::from_secs_f64(1_f64 / TICKS_PER_SECOND);
            let mut last_update_time = SystemTime::now();

            while !stream.is_terminated() {
                let game_state = state.lock().unwrap().clone();
                let _ = stream
                    .send(ws::Message::text(
                        serde_json::to_string(&game_state).unwrap(),
                    ))
                    .await;

                let now = SystemTime::now();
                let duration = now.duration_since(last_update_time).unwrap();

                if duration < tick_duration {
                    let diff = tick_duration.abs_diff(duration);
                    sleep(diff);
                }

                last_update_time = SystemTime::now();
            }

            Ok(())
        })
    })
}
