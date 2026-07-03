import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Helper function to mark active tab styles
  const isActive = (path) => location.pathname === path;

  return (
    <nav
  style={{
    background: "#0b1528",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  }}
>
  {/* Left Logo */}
  <Link
    to="/"
    style={{
      textDecoration: "none",
      fontSize: "30px",
      fontWeight: "bold",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <span style={{ color: "#ffffff" }}>🏢Corp</span>
    <span style={{ color: "#3b82f6" }}>Portal</span>
  </Link>

  {/* Right Menu */}
  <div style={{ display: "flex", gap: "24px" }}>
    <Link
      to="/"
      style={{
        color: isActive("/") ? "#3b82f6" : "hsl(0, 0%, 100%)",
        textDecoration: "none",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      Home
    </Link>

    <Link
      to="/company"
      style={{
        color: isActive("/company") ? "#3b82f6" : "hsl(0, 0%, 100%)",
        textDecoration: "none",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      Company Search
    </Link>

    <Link
      to="/director/search"
      style={{
        color:
          isActive("/director/search") ||
          location.pathname.startsWith("/director")
            ? "#3b82f6"
            : "hsl(0, 0%, 100%)",
        textDecoration: "none",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      Director Search
    </Link>

    <Link
      to="/login"
      style={{
        color: "hsl(0, 0%, 100%)",
        textDecoration: "none",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      Add Details
    </Link>
  </div>
</nav>
  );
}

export default Navbar;









