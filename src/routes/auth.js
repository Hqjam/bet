import express from 'express';
import userModel from '../models/user.model.js';
import { validateUserInput } from '../utils/validation.js';

const authrouter = express.Router();

authrouter.post("/signup", async (req, res) => {
  const errorOccurred = validateUserInput(req, res);
  if (errorOccurred) return;

  const userData = req.body;

  try {
    const user = new userModel(userData);
    await user.save();

    res.status(201).send("User signed up successfully");
    console.log("➡️  /signup route was hit");
  } catch (err) {
    res.status(500).send(`Error signing up user: ${err.message}`);
  }
});

authrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send("Invalid password");

    const token = user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).send("Login successful ✅");
    console.log("➡️  /login route was hit");
  } catch (err) {
    res.status(500).send(`Error logging in: ${err.message}`);
  }
});

authrouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logout successful");
  console.log("➡️  /logout route was hit");
});

export default authrouter;

