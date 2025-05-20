"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";

const envFilePath = path.resolve(__dirname, `.env.${env}`);

dotenv.config({ path: envFilePath });

export const {
  HOST,
  PORT,
  DB_USERNAME,
  PASSWORD,
  DATABASE,
  ACCESS_TOKEN_SECRET,
  COOKIE_KEY
} = process.env;

if (env === "production") {
  if (!ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET.includes("dev")) {
    throw new Error("Secreto JWT inseguro en producción!");
  }
}