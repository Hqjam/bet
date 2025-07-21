import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express(); // ✅ Move this to the top

import cookieParser from "cookie-parser";
import cors from "cors";

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173","https://stackmatch.duckdns.org"], // Add your frontend's local URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
import authrouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';
import feedRouter from './routes/feed.js';

app.use('/', profileRouter);
app.use('/', authrouter);
app.use('/', requestRouter);
app.use('/', feedRouter);

export default app;

