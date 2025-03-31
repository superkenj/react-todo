import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { v4 as uuidv4 } from "uuid";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const isEmailTaken = existingUsers.some((user) => user.email === email);

      if (isEmailTaken) {
        setError("Email is already registered.");
        setLoading(false);
        return;
      }

      const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      navigate("/login");
    } catch (error) {
      setError("Failed to create an account. " + error.message);
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container"> 

      <div className="icon-container">
        <img src="/TickTrack_logo.png" alt="App Icon" className="app-icon" />
      </div>
      
      <h1 className="auth-title">TickTrack</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSignup}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
