import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("shipper@transithub.com");
  const [password, setPassword] = useState("demo1234");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      return;
    }

    localStorage.setItem("auth_token", "demo-jwt-token");
    localStorage.setItem("auth_role", "SHIPPER");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to TransitHub</h1>
        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="text-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="text-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className="btn btn-primary" type="submit">
          Login
        </button>

        <p className="auth-help">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
