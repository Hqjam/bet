import express from 'express';
import userModel from '../models/user.model.js';
import { authenticateUser } from '../middlewares/Auth.js';
import { validateProfileUpdateInput } from '../utils/validation.js';
import upload           from '../middlewares/upload.single.js';   // NEW
import { uploadImage }  from '../utils/cloudinary.js';             // NEW

const profileRouter = express.Router();

/* existing GET route – NO CHANGE */
profileRouter.get("/profile/view", authenticateUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(`Error fetching profile: ${err.message}`);
  }
});

/* single PATCH route that also handles file upload */
profileRouter.patch(
  "/profile/edit",
  authenticateUser,
  upload,
  async (req, res) => {
    try {
      const updates = {};

      // only add keys that actually came in
      if (req.body.firstName) updates.firstName = req.body.firstName;
      if (req.body.lastName)  updates.lastName  = req.body.lastName;
      if (req.body.age !== undefined) updates.age = Number(req.body.age);
      if (req.body.about) updates.about = req.body.about;

      // new picture?
      if (req.file) {
        updates.profilePicture = await uploadImage(req.file.path);
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.user.userId,
        updates,
        { new: true, runValidators: true }
      ).select("-password");

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).send("Profile update failed: " + err.message);
    }
  }
);

export default profileRouter;