import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail, minLength } from "../../utils/validators";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!minLength(form.name, 2)) {
      nextErrors.name = "Full name is required.";
    }

    if (!minLength(form.company, 2)) {
      nextErrors.company = "Company name is required.";
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!minLength(form.password, 8)) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSuccessMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setSuccessMessage("Account created successfully. Redirecting to login...");
    setTimeout(() => navigate("/login"), 700);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Create shipper account</p>
        <h1>Register to TransitHub</h1>
        {successMessage ? <p className="alert alert-success">{successMessage}</p> : null}

        <label className="field-label" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          type="text"
          className={`text-input ${errors.name ? "text-input-error" : ""}`}
          value={form.name}
          onChange={handleChange("name")}
          required
        />
        {errors.name ? <p className="field-error">{errors.name}</p> : null}

        <label className="field-label" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          type="text"
          className={`text-input ${errors.company ? "text-input-error" : ""}`}
          value={form.company}
          onChange={handleChange("company")}
          required
        />
        {errors.company ? <p className="field-error">{errors.company}</p> : null}

        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`text-input ${errors.email ? "text-input-error" : ""}`}
          value={form.email}
          onChange={handleChange("email")}
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
          value={form.password}
          onChange={handleChange("password")}
          required
        />
        {errors.password ? <p className="field-error">{errors.password}</p> : null}

        <label className="field-label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={`text-input ${errors.confirmPassword ? "text-input-error" : ""}`}
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          required
        />
        {errors.confirmPassword ? (
          <p className="field-error">{errors.confirmPassword}</p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-help">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
