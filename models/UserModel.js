import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  mobile: { type: String, default: "" },
  email: { type: String, default: "" },
  password: { type: String, default: "" },
});

const UserSchema = mongoose.model(
    "UserModel",
    userSchema
)
export default UserSchema;