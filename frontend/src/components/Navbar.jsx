import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Helper helper function to mark active tab styles
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "#0b1528",
      padding: "16px 32px",
      display: "flex",
      justifyContent: "between",
      alignItems: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: "sans-serif",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.8rem" }}>🏢</span>
        <Link to="/" style={{ 
          color: "#ffffff", 
          textDecoration: "none", 
          fontSize: "1.4rem", 
          fontWeight: "700",
          letterSpacing: "0.5px"
        }}>
          Corp<span style={{ color: "#3b82f6" }}>Portal</span>
        </Link>
      </div>

      {/* Navigation Links Grid */}
      <div style={{ display: "flex", gap: "24px", marginLeft: "auto" }}>
        <Link to="/" style={{
          color: isActive("/") ? "#3b82f6" : "#9ca3af",
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "color 0.2s ease",
          padding: "6px 12px",
          borderRadius: "4px"
        }}>
          Home
        </Link>

        <Link to="/company" style={{
          color: isActive("/company") ? "#3b82f6" : "#9ca3af",
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "color 0.2s ease",
          padding: "6px 12px",
          borderRadius: "4px"
        }}>
          Company Registry
        </Link>

        <Link to="/director/search" style={{
          color: isActive("/director/search") || location.pathname.startsWith("/director") ? "#3b82f6" : "#9ca3af",
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "color 0.2s ease",
          padding: "6px 12px",
          borderRadius: "4px"
        }}>
          Director Search
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;