import express from 'express';
import userModel from '../models/user.model.js';
import connectionRequestModel from '../models/connectionRequest.models.js';
import { authenticateUser } from '../middlewares/Auth.js';

const requestRouter = express.Router();

// Send / Accept / Reject / Ignore connection requests
requestRouter.post('/request/:status/:toUserId', authenticateUser, async (req, res) => {
  const { status, toUserId } = req.params;
  const fromUserId = req.user.userId;

  const validStatuses = ["send", "accept", "reject", "ignore"];
  if (!validStatuses.includes(status)) {
    return res.status(400).send("Invalid status action.");
  }

  if (fromUserId === toUserId) {
    return res.status(400).send("Cannot perform request action on yourself.");
  }

  try {
    const receiver = await userModel.findById(toUserId);
    if (!receiver) return res.status(404).send("Target user not found.");

    if (status === "send") {
      const alreadyExists = await connectionRequestModel.findOne({
        sender: fromUserId,
        receiver: toUserId,
        status: { $in: ["pending", "accept"] }
      });

      if (alreadyExists) {
        return res.status(400).send("Connection request already sent or accepted.");
      }

      const request = new connectionRequestModel({
        sender: fromUserId,
        receiver: toUserId
      });

      await request.save();
      return res.status(201).send("Connection request sent ✅");
    }

    // For accept/reject/ignore – you must be the receiver
    const request = await connectionRequestModel.findOne({
      sender: toUserId,
      receiver: fromUserId,
      status: "pending"
    });

    if (!request) return res.status(404).send("No pending request found to act upon.");

    request.status = status;
    await request.save();

    return res.status(200).send(`Request ${status}ed successfully ✅`);
  } catch (err) {
    return res.status(500).send(`Error processing request: ${err.message}`);
  }
});

// 🟡 Incoming pending requests (to current user)
requestRouter.get('/requests/pending', authenticateUser, async (req, res) => {
  try {
    const requests = await connectionRequestModel
      .find({ receiver: req.user.userId, status: "pending" })
      .populate("sender", "firstName lastName profilePicture");

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).send(`Error fetching pending requests: ${err.message}`);
  }
});

// 🟢 Sent requests (from current user)
requestRouter.get('/requests/sent', authenticateUser, async (req, res) => {
  try {
    const requests = await connectionRequestModel
      .find({ sender: req.user.userId })
      .populate("receiver", "firstName lastName profilePicture");

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).send(`Error fetching sent requests: ${err.message}`);
  }
});

// 🔵 All requests involving the user
requestRouter.get('/requests/all', authenticateUser, async (req, res) => {
  try {
    const requests = await connectionRequestModel
      .find({
        $or: [
          { sender: req.user.userId },
          { receiver: req.user.userId }
        ]
      })
      .populate("sender", "firstName lastName profilePicture")
      .populate("receiver", "firstName lastName profilePicture");

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).send(`Error fetching all requests: ${err.message}`);
  }
});
// ❌ Cancel a pending connection request (sender only)
requestRouter.delete('/request/cancel/:toUserId', authenticateUser, async (req, res) => {
  const fromUserId = req.user.userId;
  const toUserId = req.params.toUserId;

  try {
    const request = await connectionRequestModel.findOne({
      sender: fromUserId,
      receiver: toUserId,
      status: "pending"
    });

    if (!request) {
      return res.status(404).send("No pending request found to cancel.");
    }

    await connectionRequestModel.deleteOne({ _id: request._id });

    return res.status(200).send("Connection request cancelled successfully ✅");
  } catch (err) {
    return res.status(500).send(`Error cancelling request: ${err.message}`);
  }
});
// GET /matches  → list accepted connections
requestRouter.get('/matches', authenticateUser, async (req, res) => {
  try {
    const matches = await connectionRequestModel
      .find({
        status: 'accept',
        $or: [{ sender: req.user.userId }, { receiver: req.user.userId }]
      })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('receiver', 'firstName lastName profilePicture');

    // map to only the other user
    const cleaned = matches.map(m => {
      const other = m.sender._id.toString() === req.user.userId ? m.receiver : m.sender;
      return { _id: m._id, other };
    });

    res.status(200).json(cleaned);
  } catch (err) {
    res.status(500).send(`Error fetching matches: ${err.message}`);
  }
});


export default requestRouter;
