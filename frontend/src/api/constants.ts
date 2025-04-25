const ENV = import.meta.env.MODE; // 'development' or 'production'

export const BASE_URL = "http://0.0.0.0:8000/";
export const DEPLOYED_URL = "https://codebrew-2025-backend.onrender.com/";

export const WS_URL = `${ENV === "production" ? DEPLOYED_URL : BASE_URL}game_state`;
