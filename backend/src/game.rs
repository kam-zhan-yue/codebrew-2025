use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Game {
    tick: i64,
}

impl Game {
    pub fn update(&mut self) {
        self.tick += 1;
    }
}

impl Default for Game {
    fn default() -> Self {
        Game { tick: 0 }
    }
}
