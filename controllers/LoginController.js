import {UserSchema} from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const role = "clerk";
    console.log("i got here ");
    res.status(200).json({ result: user, token, role });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { UserLogin };