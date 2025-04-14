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
        // Store user in session storage with ID for binding
        sessionStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.name, // Add username for display in welcome message
          authenticated: true,
          loginTime: new Date().toISOString()
        }));
        
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

      {/* Display the icon from the public folder */}
      <div className="icon-container">
        <img src="/TickTrack_logo.png" alt="App Icon" className="app-icon" />
      </div>

      <h1 className="auth-title">TickTrack</h1>

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