import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// 👇 collection name explicitly "login"
const Login = mongoose.model("Login", loginSchema, "login");

export default Login;