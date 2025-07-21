
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import connectDB from "./db/index.js";
import app from "./app.js";
console.log('=== ENVIRONMENT DEBUG ===');
console.log('Current working directory:', process.cwd());
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'LOADED' : 'MISSING');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'LOADED' : 'MISSING');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'LOADED' : 'MISSING');
console.log('========================');

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

