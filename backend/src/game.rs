use rocket::serde::{Deserialize, Serialize};

pub const TICKS_PER_SECOND: f64 = 120_f64;

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Game {
    player_one: PlayerState,
    player_two: PlayerState,
}

impl Game {
    pub fn update(&mut self) {}
    pub fn client_update(&mut self, payload: UpdatePayload) {
        if payload.player_id == "1" {
            self.player_one.position = payload.position;
            self.player_one.rotation = payload.rotation;
        } else if payload.player_id == "2" {
            self.player_two.position = payload.position;
            self.player_two.rotation = payload.rotation;
        }
    }
}

impl Default for Game {
    fn default() -> Self {
        Self {
            player_one: PlayerState {
                id: String::from("1"),
                position: Vector3::default(),
                rotation: Euler::default(),
            },
            player_two: PlayerState {
                id: String::from("2"),
                position: Vector3::default(),
                rotation: Euler::default(),
            },
        }
    }
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
struct PlayerState {
    id: String,
    position: Vector3,
    rotation: Euler,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
struct Vector3 {
    x: f64,
    y: f64,
    z: f64,
}

impl Default for Vector3 {
    fn default() -> Self {
        Self {
            x: 0_f64,
            y: 0_f64,
            z: 0_f64,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
struct Euler {
    x: f64,
    y: f64,
    z: f64,
}

impl Default for Euler {
    fn default() -> Self {
        Self {
            x: 0_f64,
            y: 0_f64,
            z: 0_f64,
        }
    }
}

#[derive(Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct UpdatePayload {
    player_id: String,
    position: Vector3,
    rotation: Euler,
}
