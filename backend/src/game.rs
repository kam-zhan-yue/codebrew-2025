use rocket::serde::{Deserialize, Serialize};

pub const TICKS_PER_SECOND: f64 = 120_f64;

pub struct Game {
    pub game_state: GameState,
    pub player_one_connected: bool,
    pub player_two_connected: bool,
}

impl Default for Game {
    fn default() -> Self {
        Self {
            game_state: GameState::default(),
            player_one_connected: false,
            player_two_connected: false,
        }
    }
}

impl Game {
    pub fn update(&mut self) {
        self.game_state.update();
    }

    pub fn client_update(&mut self, payload: UpdatePayload) {
        self.game_state.client_update(payload);
    }

    pub fn connect(&mut self, player_id: String) {
        if player_id == "1" {
            self.player_one_connected = true;
            self.game_state.player_one = Some(PlayerState {
                id: String::from(player_id),
                position: Vector3::default(),
                rotation: Euler::default(),
                animation_state: AnimationState::Idle,
            });
        } else {
            self.player_two_connected = true;
            self.game_state.player_two = Some(PlayerState {
                id: String::from(player_id),
                position: Vector3::default(),
                rotation: Euler::default(),
                animation_state: AnimationState::Idle,
            });
        }
    }

    pub fn disconnect(&mut self, player_id: String) {
        if player_id == "1" {
            self.player_one_connected = false;
            self.game_state.player_one = None;
        } else {
            self.player_two_connected = false;
            self.game_state.player_two = None;
        }
    }
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct GameState {
    player_one: Option<PlayerState>,
    player_two: Option<PlayerState>,
    interactions: Vec<Interaction>,
    time: f64,
}

impl GameState {
    pub fn update(&mut self) {}
    pub fn client_update(&mut self, payload: UpdatePayload) {
        if payload.player_id == "1" {
            if let Some(player) = &mut self.player_one {
                player.position = payload.position;
                player.rotation = payload.rotation;
                player.animation_state = payload.animation_state;
            }
        } else if payload.player_id == "2" {
            if let Some(player) = &mut self.player_two {
                player.position = payload.position;
                player.rotation = payload.rotation;
                player.animation_state = payload.animation_state;
            }
        }
    }
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            player_one: None,
            player_two: None,
            interactions: vec![Interaction {
                id: InteractionType::Gameboy,
                active: false,
            }],
            time: 0.0, // I have this on frontend for schema validation. Maybe we can make use of it later?
        }
    }
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub enum InteractionType {
    #[serde(rename = "gameboy")]
    Gameboy,
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
struct Interaction {
    id: InteractionType,
    active: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub enum AnimationState {
    #[serde(rename = "idle")]
    Idle,
    #[serde(rename = "walking")]
    Walking,
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
struct PlayerState {
    id: String,
    position: Vector3,
    rotation: Euler,
    animation_state: AnimationState,
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
    animation_state: AnimationState,
}
