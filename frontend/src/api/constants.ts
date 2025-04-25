const ENV = import.meta.env.MODE; // 'development' or 'production'

const BASE_URL = "http://0.0.0.0:8000/";
const DEPLOYED_URL = "https://codebrew-2025-backend.onrender.com/";

export const WS_URL = `${ENV === "production" ? DEPLOYED_URL : BASE_URL}game_state`;
