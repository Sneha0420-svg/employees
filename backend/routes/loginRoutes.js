import express from "express";
import Login from "../models/Login.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await Login.findOne({
      email,
      password,
    });
    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Success",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;