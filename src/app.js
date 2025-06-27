import express from 'express';
import userModel from "./models/user.model.js";

const app = express();
app.use(express.json()); // Important

app.post("/signup", async (req, res) => {
  const userData = {
    firstName: "Prakhar",
    lastName: "Singh ",
    email: "prakhar321123@gmail.com",
    password: "prakhar1234",
    age: 22,
    gender: "male"
  };

  try {
    const user = new userModel(userData);
    await user.save();
    res.status(201).send("User signed up successfully");
    console.log("➡️  /signup route was hit");

  } catch (err) {
    res.status(500).send(`Error signing up user: ${err.message}`);
  }
});

export default app;
