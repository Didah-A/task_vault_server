import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGODB_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.p4fixve.mongodb.net/?appName=Cluster0`;
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
