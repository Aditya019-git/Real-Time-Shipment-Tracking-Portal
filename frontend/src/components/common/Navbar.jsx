import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Real-Time Shipment Tracking</p>
        <h1 className="navbar-title">Operations Dashboard</h1>
      </div>
      <button className="btn btn-secondary" onClick={handleLogout} type="button">
        Logout
      </button>
    </header>
  );
}
