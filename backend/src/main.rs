use rocket::http::Method;

use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};


#[macro_use]
extern crate rocket;

#[launch]
fn rocket() -> _ {
    let allowed_origins = AllowedOrigins::some_exact(&["http://127.0.0.1:5173", "http://localhost:5173"]);
    // add deployed frontend URL later
    
    let cors = CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post, Method::Put, Method::Delete, Method::Options]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: AllowedHeaders::all(), // Allow all headers
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .expect("CORS fairing creation failed");

    // Creates an index route, mounts the route at / and launches the app
    rocket::build().mount("/", routes![index, hello]).attach(cors)
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/hello/<name>")]
fn hello(name: &str) -> String {
    format!("Hello, {}!", name)
}