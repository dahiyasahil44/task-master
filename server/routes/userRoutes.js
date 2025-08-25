import express from "express";
import User from "../models/User";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

export default router;
