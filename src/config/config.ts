import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "";
const DB_NAME = "task_vault";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3002;

export const config = {
  mongo: {
    url: MONGODB_URL,
    db: DB_NAME,
  },
  server: {
    port: PORT,
  },
};
