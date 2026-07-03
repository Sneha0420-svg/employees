import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/add-details");
      }
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

 return (
  <div className="login-page">

    <div className="login-card">

      {/* ADMIN LOGO */}
      <div className="logo">🏢</div>

      <h2 className="login-title">
        <span style={{color:"#0b3d91"}}>Admin</span>{" "}
        <span style={{color:"#42a5f5"}}>Login</span>
      </h2>

      <p className="login-subtitle">
        Enter your credentials to continue
      </p>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button className="login-btn" type="submit">
          Login
        </button>

      </form>

    </div>

  </div>
);
}

export default Login;