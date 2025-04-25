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
        let scaled_vector = payload.velocity * (1_f64 / TICKS_PER_SECOND);

        if payload.player_id == "1" {
            self.player_one.position += scaled_vector;
        } else if payload.player_id == "2" {
            self.player_two.position += scaled_vector;
        }
    }
}

impl Default for Game {
    fn default() -> Self {
        Self {
            player_one: PlayerState {
                id: String::from("1"),
                position: Vector3::default(),
            },
            player_two: PlayerState {
                id: String::from("2"),
                position: Vector3::default(),
            },
        }
    }
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
struct PlayerState {
    id: String,
    position: Vector3,
}

#[derive(Serialize, Deserialize, Clone)]
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

impl std::ops::Add for Vector3 {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
        }
    }
}

impl std::ops::AddAssign for Vector3 {
    fn add_assign(&mut self, rhs: Self) {
        self.x = self.x + rhs.x;
        self.y = self.y + rhs.y;
        self.z = self.z + rhs.z;
    }
}

impl std::ops::Mul<f64> for Vector3 {
    type Output = Self;

    fn mul(self, rhs: f64) -> Self::Output {
        Self {
            x: self.x * rhs,
            y: self.y * rhs,
            z: self.z * rhs,
        }
    }
}

#[derive(Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct UpdatePayload {
    player_id: String,
    velocity: Vector3,
}
