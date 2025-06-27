import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import app from "./app.js"; 
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port Party!! ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to the database Stupid: ${err.message}`);
    process.exit(1);
  });
