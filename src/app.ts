import express from "express";
import dotenv from "dotenv";
import audioRoutes from "./routes/audio.routes";
dotenv.config();
import { db } from "./config/db";

// Initialize DB connection once at app startup. Success log is handled in db.ts
db().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", audioRoutes);

export default app;