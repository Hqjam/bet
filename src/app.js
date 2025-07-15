import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

import authrouter from './routes/auth.js';
import profileRouter from './routes/profile.js';

import requestRouter from './routes/request.js';
import feedRouter from './routes/feed.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', profileRouter); 
app.use('/', authrouter); 
app.use('/', requestRouter); 
app.use('/', feedRouter); 




export default app;
