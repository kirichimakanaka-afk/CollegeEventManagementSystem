import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
return (
<header className="navbar">
<Link to="/" className="navbar-brand">
<span className="brand-icon">C</span>
<span>
<strong>CampusConnect</strong>
<small>College Event Management</small>
</span>
</Link>

  <nav className="nav-links">
    <NavLink to="/" end>
      Home
    </NavLink>

    <NavLink to="/events">
      Events
    </NavLink>

    <NavLink to="/dashboard">
      My Events
    </NavLink>

    <NavLink to="/admin-login">
      Admin Panel
    </NavLink>
  </nav>

  <div className="nav-actions">
    <Link to="/login" className="login-link">
      Login
    </Link>

    <Link to="/register" className="nav-register">
      Get Started
    </Link>
  </div>
</header>

);
}

export default Navbar;