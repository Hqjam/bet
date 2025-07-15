import express from 'express';
import userModel from '../models/user.model.js';
import { authenticateUser } from '../middlewares/Auth.js';
import { validateProfileUpdateInput } from '../utils/validation.js';

const profileRouter = express.Router();

profileRouter.get("/profile/view", authenticateUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
    console.log("➡️  /profile/view route was hit");
  } catch (err) {
    res.status(500).send(`Error fetching profile: ${err.message}`);
  }
});

profileRouter.put("/profile/edit", authenticateUser, async (req, res) => {
  const { firstName, lastName, age, about, profilePicture } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, age, about, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
    console.log("➡️  /profile/edit route was hit");
  } catch (err) {
    res.status(500).send(`Error updating profile: ${err.message}`);
  }
});
profileRouter.patch("/profile/edit", authenticateUser, async (req, res) => {
  const errorOccurred = validateProfileUpdateInput(req, res);
  if (errorOccurred) return;

  const { firstName, lastName, age, about, profilePicture } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, age, about, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
    console.log("➡️  /profile/edit route was hit");
  } catch (err) {
    res.status(500).send(`Error updating profile: ${err.message}`);
  }
});

export default profileRouter;

