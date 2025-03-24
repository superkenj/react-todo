<<<<<<< HEAD
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      const user = storedUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        onLogin(user);
        navigate("/");
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Failed to log in. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container"> 
      <h1 className="auth-title">LOGIN</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
=======
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const navigate = useNavigate()

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleStatusChange)
    window.addEventListener("offline", handleStatusChange)

    return () => {
      window.removeEventListener("online", handleStatusChange)
      window.removeEventListener("offline", handleStatusChange)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Local Authentication
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.email === email && user.password === password) {
        // Simulate successful login
        console.log("Local login successful")
        onLogin();
        navigate("/", { replace: true });
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
    } else {
      setError("No user found. Please sign up first.")
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">LOGIN</h1>

      {!isOnline && (
        <div className="offline-message">You are currently offline. Logging in with local credentials.</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <div className="input-icon">
            <span>@</span>
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <div className="input-icon">
            <span>🔒</span>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <p className="auth-link">
        New here? <Link to="/signup">Create an Account</Link>
      </p>
    </div>
  )
}

export default Login

>>>>>>> 035e71d4fcdfde2ccbe041222a157dc6cf69c450
