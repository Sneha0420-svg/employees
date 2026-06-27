import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function DirectorsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // Autocomplete Suggestion States
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTyping = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      const employees = Array.isArray(res.data) ? res.data : [];

      const matches = employees
        .filter(
          (emp) =>
            emp.name?.toLowerCase().includes(text.toLowerCase()) ||
            emp.DIN?.toLowerCase().includes(text.toLowerCase())
        )
        .map((emp) => ({ name: emp.name, din: emp.DIN, id: emp._id }));

      setSuggestions(matches.slice(0, 8));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error loading live director records", err);
    }
  };

  const searchDirector = async (searchText) => {
    const text = searchText?.trim();
    if (!text) {
      setDirector(null);
      return;
    }

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      const employees = Array.isArray(res.data) ? res.data : [];

      const foundDirector = employees.find(
        (emp) =>
          emp._id === text ||
          emp.name?.toLowerCase() === text.toLowerCase() ||
          emp.DIN?.toLowerCase() === text.toLowerCase()
      );

      if (foundDirector) {
        setDirector(foundDirector);
        setQuery(foundDirector.name || "");
      } else {
        setError("No director matching that Name or DIN was found.");
        setDirector(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load director details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && location.state?.automatic) {
      searchDirector(id);
    } else {
      setDirector(null);
      setError(null);
    }
  }, [id, location.state]);

  const handleSearch = () => {
    searchDirector(query);
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* SEARCH CONTAINER */}
      <div ref={dropdownRef} style={{ display: "flex", gap: "10px", marginBottom: "30px", alignItems: "center", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder="Search director name or DIN..."
            style={{ width: "320px", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "1rem" }}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul style={{
              position: "absolute", top: "46px", left: 0, width: "100%", background: "#ffffff",
              border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              listStyle: "none", margin: 0, padding: "6px 0", zIndex: 50, maxHeight: "280px", overflowY: "auto"
            }}>
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setQuery(item.name);
                    setShowSuggestions(false);
                    searchDirector(item.id);
                  }}
                  style={{
                    padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                    borderBottom: index !== suggestions.length - 1 ? "1px solid #f1f5f9" : "none", fontSize: "0.95rem"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <span style={{ fontSize: "1.1rem" }}>👤</span>
                  <div>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>DIN: {item.din || "N/A"}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSearch}
          style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "500", height: "42px" }}
        >
          Search
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#64748b" }}>Searching database...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc2626", fontSize: "1.1rem" }}>{error}</p>}

      {director && (
        <div style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ background: "#4c1d95", color: "white", padding: "32px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
              👤
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "700" }}>Directors Page</h1>
              <p style={{ margin: "4px 0 0 0", color: "#ddd6fe", fontSize: "1rem" }}>Detailed Profile Information</p>
            </div>
          </div>

          <div style={{ padding: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "48px", alignItems: "start" }}>
            {/* LEFT PROFILE CARD */}
            <div>
              <h2 style={{ marginTop: 0, marginBottom: "24px", fontSize: "1.5rem", fontWeight: "700", color: "#1e293b", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
                Personal Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "1.1rem" }}>
                <p style={{ margin: 0 }}><strong>Name:</strong> <span style={{ color: "#334155" }}>{director.name}</span></p>
                <p style={{ margin: 0 }}><strong>DIN:</strong> <span style={{ color: "#334155" }}>{director.DIN || "N/A"}</span></p>
                <p style={{ margin: 0 }}><strong>Email:</strong> <span style={{ color: "#334155" }}>{director.email || "N/A"}</span></p>
                <p style={{ margin: 0 }}><strong>Phone:</strong> <span style={{ color: "#334155" }}>{director.phone || "N/A"}</span></p>
                <p style={{ margin: 0 }}><strong>Designation:</strong> <span style={{ color: "#334155" }}>{director.designation || "N/A"}</span></p>
              </div>
            </div>

            {/* RIGHT SIDE TABLE PROFILE */}
            <div>
              <h2 style={{ marginTop: 0, marginBottom: "24px", fontSize: "1.5rem", fontWeight: "700", color: "#1e293b", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
                Career History
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "12px", color: "#475569", fontWeight: "600" }}>Company</th>
                      <th style={{ padding: "12px", color: "#475569", fontWeight: "600" }}>Role</th>
                      <th style={{ padding: "12px", color: "#475569", fontWeight: "600" }}>Joining</th>
                      <th style={{ padding: "12px", color: "#475569", fontWeight: "600" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {director.careerHistory?.map((career, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        {/* NO MORE UNDERLINES HERE */}
                        <td
                          style={{ 
                            padding: "14px 12px", 
                            color: "#2563eb", 
                            cursor: "pointer", 
                            fontWeight: "600",
                            textDecoration: "none" // Force removal
                          }}
                          onClick={() => navigate(`/company?name=${encodeURIComponent(career.company)}`, { state: { automatic: true } })}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = "none"; // Keeps text line off
                            e.target.style.color = "#1d4ed8"; // Subtle deep blue toggle instead
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "#2563eb";
                          }}
                        >
                          {career.company}
                        </td>
                        <td style={{ padding: "14px 12px", color: "#475569" }}>{career.role}</td>
                        <td style={{ padding: "14px 12px", color: "#475569" }}>{career.joiningDate}</td>
                        <td style={{ padding: "14px 12px" }}>
                          <span style={{
                            padding: "4px 12px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: "600",
                            background: (career.status?.toLowerCase() === "active" || career.status?.toLowerCase() === "present") ? "#dcfce7" : "#f1f5f9",
                            color: (career.status?.toLowerCase() === "active" || career.status?.toLowerCase() === "present") ? "#15803d" : "#475569"
                          }}>
                            {career.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectorsPage;