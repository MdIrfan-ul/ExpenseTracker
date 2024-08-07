import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is Required"],minLength:[3,"Name should have atleast 3 characters"],maxLength:[30,"Name should not exceed more than 30 characters"] },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: [true, "Email is Already registered"],
    match: [
      /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please enter a valid email",
    ]
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minLength: [8, "Password must have or more than 8 characters"],
    maxLength: [16, "Password should not exceed more than 16 characters"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const userModel = mongoose.model("User", userSchema);

export { userModel };
