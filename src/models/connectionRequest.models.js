import mongoose from "mongoose";
const connectionRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
  type: String,
  enum: ["ignore", "pending", "accept", "reject"],
  default: "pending"
},
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});    
const connectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
export default connectionRequestModel;