const ENV = import.meta.env.MODE; // 'development' or 'production'

const BASE_URL = "http://0.0.0.0:8000/";
const DEPLOYED_URL = "https://codebrew-2025-backend.onrender.com/";

export const PRODUCTION = ENV === "production";
export const WS_URL = `${PRODUCTION ? DEPLOYED_URL : BASE_URL}game_state`;
