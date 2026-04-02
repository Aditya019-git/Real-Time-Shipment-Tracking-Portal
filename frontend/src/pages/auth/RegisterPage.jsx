import { Link, useNavigate } from "react-router-dom";

export function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Create shipper account</p>
        <h1>Register to TransitHub</h1>

        <label className="field-label" htmlFor="name">
          Full name
        </label>
        <input id="name" type="text" className="text-input" required />

        <label className="field-label" htmlFor="company">
          Company
        </label>
        <input id="company" type="text" className="text-input" required />

        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input id="email" type="email" className="text-input" required />

        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input id="password" type="password" className="text-input" required />

        <button className="btn btn-primary" type="submit">
          Create account
        </button>

        <p className="auth-help">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
