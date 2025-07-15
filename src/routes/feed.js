import express from 'express';
import userModel from '../models/user.model.js';
import connectionRequestModel from '../models/connectionRequest.models.js';
import { authenticateUser } from '../middlewares/Auth.js';

const feedRouter = express.Router();

feedRouter.get("/feed", authenticateUser, async (req, res) => {
  const currentUserId = req.user.userId;

  // ⬇️  Extract pagination query params
  const page = parseInt(req.query.page) || 1;   // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 per page
  const skip = (page - 1) * limit;

  try {
    // 🔎 Get all requests where user is involved and status is accepted or rejected
    const requests = await connectionRequestModel.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ],
      status: { $in: ["accept", "reject"] }
    });

    // ❌ Exclude yourself + all connected/rejected users
    const excludedUserIds = new Set([currentUserId]);
    requests.forEach((req) => {
      if (req.sender.toString() !== currentUserId) excludedUserIds.add(req.sender.toString());
      if (req.receiver.toString() !== currentUserId) excludedUserIds.add(req.receiver.toString());
    });

    // 📦 Final paginated user query
    const users = await userModel
      .find({ _id: { $nin: Array.from(excludedUserIds) } })
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(`Error generating feed: ${err.message}`);
  }
});

export default feedRouter;
