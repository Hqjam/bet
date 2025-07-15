import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  age:       { type: Number, required: true, min: 18 },
  gender:    { type: String, required: true },
  about:     { type: String, default: "No information provided" },
  profilePicture: {
    type: String,
    default: "https://www.mauicardiovascularsymposium.com/wp-content/uploads/2019/08/dummy-profile-pic-300x300.png"
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// ✅ Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
