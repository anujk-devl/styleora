import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = createToken(user._id);

    res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: true,       
    sameSite: "none",    
    maxAge: 24 * 60 * 60 * 1000
});
res.json({ user: { _id: user._id, name: user.name, email: user.email } }); 

res.json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("styleora_token").json({ message: "Logged out" });
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
