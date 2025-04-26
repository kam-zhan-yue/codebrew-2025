use rand::random_bool;
use rocket::serde::{Deserialize, Serialize};

pub const TICKS_PER_SECOND: f64 = 120_f64;

fn vec_eq<T: PartialEq>(vec1: &Vec<T>, vec2: &Vec<T>) -> bool {
    vec1.iter().zip(vec2).all(|(item1, item2)| *item1 == *item2)
}

pub struct Game {
    pub game_state: GameState,
    pub player_one_connected: bool,
    pub player_two_connected: bool,
    pub player_one_tasks: Option<Vec<InteractionTarget>>,
    pub player_two_tasks: Option<Vec<InteractionTarget>>,
    player_one_resetting: bool,
    player_two_resetting: bool,
    started: bool,
}

impl Default for Game {
    fn default() -> Self {
        Self {
            game_state: GameState::default(),
            player_one_connected: false,
            player_two_connected: false,
            player_one_tasks: None,
            player_two_tasks: None,
            player_one_resetting: false,
            player_two_resetting: false,
            started: false,
        }
    }
}

impl Game {
    pub fn update(&mut self) {
        self.game_state.update();

        if let Some(countdown) = &self.game_state.countdown {
            if *countdown < 0_f64 && !self.started {
                let player_one_tasks = self.get_randomised_tasks();
                let mut player_two_tasks = self.get_randomised_tasks();

                while vec_eq(&player_one_tasks, &player_two_tasks) {
                    player_two_tasks = self.get_randomised_tasks();
                }

                self.player_one_tasks = Some(player_one_tasks);
                self.player_two_tasks = Some(player_two_tasks);
                self.started = true;
            }
        }

        if self.started && self.game_state.winner_id.is_none() {
            let translated_interactions: Vec<InteractionTarget> = self
                .game_state
                .interactions
                .iter()
                .map(|task| InteractionTarget {
                    id: task.id.clone(),
                    target_state: task.active,
                })
                .collect();

            if vec_eq(
                &translated_interactions,
                &self.player_one_tasks.as_ref().unwrap(),
            ) {
                self.game_state.winner_id = Some(String::from("1"));
            } else if vec_eq(
                &translated_interactions,
                &self.player_two_tasks.as_ref().unwrap(),
            ) {
                self.game_state.winner_id = Some(String::from("2"));
            } else {
                self.game_state.winner_id = None;
            }
        }

        if self.game_state.winner_id.is_some()
            && self.player_one_resetting
            && self.player_two_resetting
        {
            self.game_state = GameState::default();
            self.connect(String::from("1"));
            self.connect(String::from("2"));
            self.player_one_resetting = false;
            self.player_two_resetting = false;
            self.game_state.countdown = Some(5_f64);
        }
    }

    fn get_randomised_tasks(&self) -> Vec<InteractionTarget> {
        self.game_state
            .interactions
            .clone()
            .into_iter()
            .map(|interaction| InteractionTarget {
                id: interaction.id,
                target_state: random_bool(0.5),
            })
            .collect()
    }

    pub fn client_update(&mut self, payload: UpdatePayload) {
        match payload.message_id {
            MessageType::Restart => {
                if payload.player_id == "1" {
                    if let Some(reset) = payload.restart {
                        self.player_one_resetting = reset;
                    }
                } else if payload.player_id == "2" {
                    if let Some(reset) = payload.restart {
                        self.player_two_resetting = reset;
                    }
                }
            }
            _ => {}
        }

        self.game_state.client_update(payload);
    }

    pub fn connect(&mut self, player_id: String) {
        let both_not_connected = !self.player_one_connected || !self.player_two_connected;

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

        let both_connected = self.player_one_connected && self.player_two_connected;

        if both_not_connected && both_connected {
            self.game_state.countdown = Some(5_f64);
        }
    }

    pub fn disconnect(&mut self, player_id: String) {
        let player_disconnected = if player_id == "1" {
            self.player_one_connected = false;
            self.game_state.player_one = None;
            true
        } else if player_id == "2" {
            self.player_two_connected = false;
            self.game_state.player_two = None;
            true
        } else {
            false
        };

        if player_disconnected {
            self.started = false;
            self.game_state.countdown = None;
            self.player_one_tasks = None;
            self.player_two_tasks = None;
        }
    }
}

#[derive(Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct GameState {
    player_one: Option<PlayerState>,
    player_two: Option<PlayerState>,
    interactions: Vec<Interaction>,
    winner_id: Option<String>,
    countdown: Option<f64>,
}

impl GameState {
    pub fn update(&mut self) {
        if let Some(countdown) = self.countdown {
            if countdown > 0_f64 {
                self.countdown = Some(countdown - 1_f64 / TICKS_PER_SECOND);
            }
        }
    }

    pub fn client_update(&mut self, payload: UpdatePayload) {
        match payload.message_id {
            MessageType::Player => {
                let player_ref = if payload.player_id == "1" {
                    &mut self.player_one
                } else if payload.player_id == "2" {
                    &mut self.player_two
                } else {
                    &mut None
                };

                if let Some(player) = player_ref {
                    if let Some(position) = payload.position {
                        player.position = position;
                    }

                    if let Some(rotation) = payload.rotation {
                        player.rotation = rotation;
                    }

                    if let Some(animation_state) = payload.animation_state {
                        player.animation_state = animation_state
                    }
                }
            }
            MessageType::Interaction => {
                if let Some(interaction_id) = payload.interaction_id {
                    if let Some(found_interaction_index) = self
                        .interactions
                        .iter()
                        .position(|interaction| interaction.id == interaction_id)
                    {
                        let interaction = &mut self.interactions[found_interaction_index];

                        if let Some(active) = payload.active {
                            interaction.active = active;
                        }
                    }
                }
            }
            MessageType::Restart => {}
        }
    }

    fn get_randomised_tasks() -> Vec<Interaction> {
        let interactions = vec![Interaction {
            id: InteractionType::Gameboy,
            active: false,
        }];

        interactions
            .into_iter()
            .map(|interaction| Interaction {
                id: interaction.id,
                active: random_bool(0.5),
            })
            .collect()
    }
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            player_one: None,
            player_two: None,
            interactions: GameState::get_randomised_tasks(),
            winner_id: None,
            countdown: None,
        }
    }
}

#[derive(Serialize, Clone, Deserialize, Debug, PartialEq)]
#[serde(crate = "rocket::serde")]
pub enum InteractionType {
    #[serde(rename = "gameboy")]
    Gameboy,
}

#[derive(Serialize, Clone, PartialEq)]
#[serde(crate = "rocket::serde")]
struct Interaction {
    id: InteractionType,
    active: bool,
}

#[derive(Serialize, Clone, PartialEq)]
#[serde(crate = "rocket::serde")]
pub struct InteractionTarget {
    id: InteractionType,
    target_state: bool,
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
    message_id: MessageType,
    player_id: String,
    position: Option<Vector3>,
    rotation: Option<Euler>,
    animation_state: Option<AnimationState>,
    interaction_id: Option<InteractionType>,
    active: Option<bool>,
    restart: Option<bool>,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde", rename_all = "lowercase")]
enum MessageType {
    Player,
    Interaction,
    Restart,
}
