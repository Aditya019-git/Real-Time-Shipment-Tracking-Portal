import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail, minLength } from "../../utils/validators";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("shipper@transithub.com");
  const [password, setPassword] = useState("demo1234");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const nextErrors = {};

    if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!minLength(password, 6)) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem("auth_token", "demo-jwt-token");
      localStorage.setItem("auth_role", "SHIPPER");
      navigate("/dashboard");
    } catch {
      setServerError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to TransitHub</h1>
        {serverError ? <p className="alert alert-error">{serverError}</p> : null}
        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`text-input ${errors.email ? "text-input-error" : ""}`}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          aria-invalid={Boolean(errors.email)}
          required
        />
        {errors.email ? <p className="field-error">{errors.email}</p> : null}

        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`text-input ${errors.password ? "text-input-error" : ""}`}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          aria-invalid={Boolean(errors.password)}
          required
        />
        {errors.password ? <p className="field-error">{errors.password}</p> : null}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>

        <p className="auth-help">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
