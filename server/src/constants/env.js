import dotenv from "dotenv";

dotenv.config();

const getEnv = (key, defaultValue) => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "4004");
export const MONGO_URI = getEnv("MONGO_URI");
// export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
// export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
// export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const EMAIL_FROM = getEnv("EMAIL_FROM");
export const EMAIL_FROM_NAME = getEnv("EMAIL_FROM_NAME");

export const CLIENT_URL = getEnv("CLIENT_URL", "http://localhost:5173");
export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
// export const GEMINI_API_KEY = getEnv("GEMINI_API_KEY");
