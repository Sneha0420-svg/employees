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

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const parseToTimestamp = (dateVal) => {
    if (!dateVal || dateVal === "-" || dateVal === "Present") return 0;
    const date = new Date(dateVal);
    if (!isNaN(date.getTime())) return date.getTime();

    if (typeof dateVal === "string") {
      const parts = dateVal.split(/[-/]/);
      if (parts.length === 3) {
        const parsedObj = parts[0].length === 4 
          ? new Date(parts[0], parts[1] - 1, parts[2]) 
          : new Date(parts[2], parts[1] - 1, parts[0]);
        if (!isNaN(parsedObj.getTime())) return parsedObj.getTime();
      }
    }
    return 0; 
  };

  const formatMonthYear = (dateVal) => {
    if (!dateVal || dateVal === "-" || dateVal === "Present") return "-";
    const timestamp = parseToTimestamp(dateVal);
    if (timestamp === 0) return typeof dateVal === "string" ? dateVal : "-";
    return new Date(timestamp).toLocaleString("default", { month: "short", year: "numeric" });
  };

  const getSortedCareerHistory = (historyArray) => {
    if (!historyArray) return [];
    return [...historyArray].sort((a, b) => {
      const statusA = a.status?.toLowerCase();
      const statusB = b.status?.toLowerCase();
      const isActiveA = statusA === "active" || statusA === "present";
      const isActiveB = statusB === "active" || statusB === "present";
      if (isActiveA && !isActiveB) return -1;
      if (!isActiveA && isActiveB) return 1;
      const dateResignA = a.resigningDate || a.leavingDate;
      const dateResignB = b.resigningDate || b.leavingDate;
      const timeA = parseToTimestamp(dateResignA);
      const timeB = parseToTimestamp(dateResignB);
      if (timeA === timeB) {
        const joinA = parseToTimestamp(a.joiningDate);
        const joinB = parseToTimestamp(b.joiningDate);
        return joinB - joinA;
      }
      return timeB - timeA; 
    });
  };

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
        .filter((emp) => emp.name?.toLowerCase().includes(text.toLowerCase()) || emp.DIN?.toLowerCase().includes(text.toLowerCase()))
        .map((emp) => ({ name: emp.name, din: emp.DIN, id: emp._id }));
      const matchedDirectors = matches.slice(0, 8);

setSuggestions(matchedDirectors);
setShowSuggestions(true);
    } catch (err) {
      console.error("Error loading live director records", err);
    }
  };

  const searchDirector = async (searchText) => {
    const text = searchText?.trim();
    if (!text) { setDirector(null); return; }
    setLoading(true); setError(null); setShowSuggestions(false);
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      const employees = Array.isArray(res.data) ? res.data : [];
      const foundDirector = employees.find((emp) => emp._id === text || emp.name?.toLowerCase() === text.toLowerCase() || emp.DIN?.toLowerCase() === text.toLowerCase());
      if (foundDirector) { setDirector(foundDirector); setQuery(foundDirector.name || ""); } 
      else { setError("No director matching that Name or DIN was found."); setDirector(null); }
    } catch (err) { setError("Failed to load director details."); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (id && location.state?.automatic) { searchDirector(id); }
  }, [id, location.state]);

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <div ref={dropdownRef} style={{ display: "flex", gap: "10px", marginBottom: "30px", alignItems: "center", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchDirector(query)}
            placeholder="Search director name or DIN..."
            style={{ width: "320px", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{ position: "absolute", top: "46px", left: 0, width: "100%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", listStyle: "none", margin: 0, padding: "6px 0", zIndex: 50 }}>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => { setQuery(item.name); setShowSuggestions(false); searchDirector(item.id); }} style={{ padding: "10px 16px", cursor: "pointer" }}>
                  <div style={{ fontWeight: "600" }}>{item.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>DIN: {item.din || "-"}</div>
                </li>
              ))}
            </ul>
          )}
          {showSuggestions && suggestions.length === 0 && query.trim() !== "" && (
  <div
    style={{
      position: "absolute",
      top: "46px",
      left: 0,
      width: "100%",
      
      
      padding: "12px",
      color: "#dc2626",
      fontWeight: "400",
      zIndex: 50,
      textAlign: "center",
    }}
  >
    Director Not Found
  </div>
)}
        </div>

        <button onClick={() => searchDirector(query)} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer" }}>Search</button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Searching...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>}

      {director && (
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ background: "#4c1d95", color: "white", padding: "32px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>👤</div>
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem" }}>Directors Page</h1>
            </div>
          </div>

          <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Top Section */}
           {/* Top Section */}
<div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
  {/* Director Image */}
  <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", flexShrink: 0 }}>
    👤
  </div>
  
  {/* Personal Details - Now single column */}
  <div style={{ width: "800px" }}>
    <h2 style={{ marginTop: 0, marginBottom: "16px", fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>
      Personal Details
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "1rem" }}>
      <p style={{ margin: 0 }}><strong>Name:</strong> {director.name}</p>
      <p style={{ margin: 0 }}><strong>DIN:</strong> {director.DIN || "-"}</p>
      <p style={{ margin: 0 }}><strong>Gender:</strong> {director.gender || "-"}</p>
      <p style={{ margin: 0 }}><strong>Nationality:</strong> {director.nationality || "-"}</p>
      <p style={{ margin: 0 }}><strong>Qualification:</strong> {director.qualification || "-"}</p>
    </div>
  </div>
</div>

            {/* Bottom Section */}
            <div>
              <h2 style={{ marginTop: 0, borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>Employeement History</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "12px" }}>Company</th>
                    <th style={{ padding: "12px" }}>Role</th>
                    <th style={{ padding: "12px" }}>Joining</th>
                    <th style={{ padding: "12px" }}>Resignation</th>
                    <th style={{ padding: "12px" }}>Status</th>
                  </tr>
                </thead>
                
<tbody>
  {getSortedCareerHistory(director.careerHistory).map((career, idx) => {
    const status = career.status?.toLowerCase();

    return (
      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
        <td 
          style={{ padding: "14px 12px", color: "#2563eb", cursor: "pointer" }} 
          onClick={() => navigate(`/company?name=${encodeURIComponent(career.company)}`, { state: { automatic: true } })}
        >
          {career.company}
        </td>
        <td style={{ padding: "14px 12px" }}>{career.role || "-"}</td>
        <td style={{ padding: "14px 12px" }}>{formatMonthYear(career.joiningDate)}</td>
        
        {/* Date-only display logic */}
        <td style={{ padding: "14px 12px" }}>
          {status === "active" || status === "present" 
            ? "Present" 
            : (career.resigningDate && career.resigningDate !== "-" 
                ? formatMonthYear(career.resigningDate) 
                : "-")
          }
        </td>
        

        <td style={{ padding: "14px 12px" }}>
          <span style={{ 
            padding: "4px 12px", 
            borderRadius: "999px", 
            background: status === "active" ? "#dcfce7" : "#fee2e2" 
          }}>
            {career.status || "-"}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectorsPage;