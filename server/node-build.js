import { createServer } from "./index.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/database.js";
import userRouter from "./routes/user.Routes.js"; // <-- fixed

dotenv.config();

connectDb();

const app = createServer();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Nodejs Authentication Tutorial");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
