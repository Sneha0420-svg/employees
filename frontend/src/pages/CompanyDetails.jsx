import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function CompanyDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // 🔹 NEW HELPER: Ensures website URLs always open externally and don't route back to your project
  const formatExternalUrl = (url, companyName) => {
    if (!url || url.trim() === "" || url === "N/A") {
      return `https://www.google.com/search?q=${encodeURIComponent(companyName + ' official website')}`;
    }
    const cleanUrl = url.trim();
    // If it doesn't start with http:// or https://, prepend https://
    if (/^https?:\/\//i.test(cleanUrl)) {
      return cleanUrl;
    }
    return `https://${cleanUrl}`;
  };

  const formatMonthYear = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        const parsedObj = parts[0].length === 4 
          ? new Date(parts[0], parts[1] - 1, parts[2])
          : new Date(parts[2], parts[1] - 1, parts[0]);
        if (!isNaN(parsedObj.getTime())) {
          return parsedObj.toLocaleString("default", { month: "short", year: "numeric" });
        }
      }
      return dateStr; 
    }
    return date.toLocaleString("default", { month: "short", year: "numeric" });
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
      const uniqueCompanies = new Map();

      employees.forEach((emp) => {
        const company = emp.companyDetails;
        if (company?.companyName) {
          const name = company.companyName;
          const cin = company.cin || "";
          
          if (
            name.toLowerCase().includes(text.toLowerCase()) ||
            cin.toLowerCase().includes(text.toLowerCase())
          ) {
            uniqueCompanies.set(name.toLowerCase(), { name, cin });
          }
        }
      });

      setSuggestions(Array.from(uniqueCompanies.values()).slice(0, 8));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error loading live suggestions", err);
    }
  };

  const searchCompany = async (searchText) => {
    const text = searchText?.trim();
    if (!text) {
      setSelectedCompany(null);
      return;
    }

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      const employees = Array.isArray(res.data) ? res.data : [];

      let companyData = {
        name: "",
        description: "No description available",
        cin: "N/A",
        registerNo: "N/A",
        category: "N/A",
        website: "",
        activeEmployees: [],
      };

      let companyFound = false;

      employees.forEach((emp) => {
        const company = emp.companyDetails;

        if (
          company &&
          (company.companyName?.toLowerCase() === text.toLowerCase() ||
            company.cin?.toLowerCase() === text.toLowerCase() ||
            company.companyName?.toLowerCase().includes(text.toLowerCase()))
        ) {
          companyFound = true;
          companyData.name = company.companyName;
          companyData.description = company.description || companyData.description;
          companyData.cin = company.cin || "N/A";
          companyData.registerNo = company.registerNo || "N/A";
          companyData.category = company.industry || "N/A";
          companyData.website = company.website || company.officialWebsite || "";
        }

        emp.careerHistory?.forEach((career) => {
          if (career.company && career.company.toLowerCase().includes(text.toLowerCase())) {
            const status = career.status?.toLowerCase();
            if (status === "active" || status === "present") {
              if (!companyData.activeEmployees.some((e) => e.id === emp._id)) {
                companyData.activeEmployees.push({
                  id: emp._id,
                  name: emp.name,
                  din: emp.DIN,
                  designation: career.role,
                  appointmentDate: career.joiningDate,
                });
              }
            }
          }
        });
      });

      if (companyFound || companyData.activeEmployees.length > 0) {
        if (!companyData.name) companyData.name = text;
        setSelectedCompany(companyData);
      } else {
        setError("No company matching that name or CIN was found.");
        setSelectedCompany(null);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const companyNameParam = searchParams.get("name");
    if (companyNameParam && location.state?.automatic) {
      setQuery(companyNameParam);
      searchCompany(companyNameParam);
    }
  }, [searchParams, location.state]);

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ background: "#0b1528", color: "white", padding: "24px", textAlign: "center", borderRadius: "12px", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem" }}>Company Information Portal</h1>
      </div>

      {/* SEARCH INTERFACE */}
      <div ref={dropdownRef} style={{ display: "flex", justifyContent: "center", marginBottom: "30px", gap: "10px", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchCompany(query)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder="Search company name or CIN..."
            style={{ width: "400px", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "1rem" }}
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
                    searchCompany(item.name);
                  }}
                  style={{ padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", borderBottom: index !== suggestions.length - 1 ? "1px solid #f1f5f9" : "none", fontSize: "0.95rem" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <span style={{ fontSize: "1.1rem" }}>🏢</span>
                  <div>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>CIN: {item.cin}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button 
          onClick={() => searchCompany(query)} 
          style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "500", height: "42px" }}
        >
          Search
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Searching database...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc2626", fontSize: "1.1rem" }}>{error}</p>}

      {selectedCompany && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", background: "#fff" }}>
            <h2 style={{ marginTop: 0, borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", color: "#1f2937" }}>About Company</h2>
            <p style={{ color: "#4b5563", lineHeight: "1.6", fontSize: "1.05rem" }}>{selectedCompany.description}</p>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", background: "#fff" }}>
            <h2 style={{ marginTop: 0, borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", color: "#1f2937" }}>Company Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "1.1rem", marginTop: "16px" }}>
              <p style={{ margin: 0 }}>
                <strong>Name:</strong>{" "}
                {/* 🔹 FIXED ANCHOR LINK (Uses our external safety formatter tool) */}
                <a 
                  href={formatExternalUrl(selectedCompany.website, selectedCompany.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ background: "#eff6ff", color: "#1e40af", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", display: "inline-block", textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => e.target.style.background = "#dbeafe"}
                  onMouseLeave={(e) => e.target.style.background = "#eff6ff"}
                >
                  {selectedCompany.name} 🔗
                </a>
              </p>
              <p style={{ margin: 0 }}><strong>CIN:</strong> <span style={{ color: "#4b5563" }}>{selectedCompany.cin}</span></p>
              <p style={{ margin: 0 }}><strong>Register No:</strong> <span style={{ color: "#4b5563" }}>{selectedCompany.registerNo}</span></p>
              <p style={{ margin: 0 }}><strong>Category:</strong> <span style={{ color: "#4b5563" }}>{selectedCompany.category}</span></p>
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", background: "#fff", overflowX: "auto" }}>
            <h2 style={{ marginTop: 0, borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", color: "#1f2937" }}>Current Directors</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                  <th style={{ padding: "14px", color: "#374151", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "14px", color: "#374151", fontWeight: "600" }}>DIN</th>
                  <th style={{ padding: "14px", color: "#374151", fontWeight: "600" }}>Designation</th>
                  <th style={{ padding: "14px", color: "#374151", fontWeight: "600" }}>Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedCompany.activeEmployees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td
                      style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600", padding: "14px" }}
                      onClick={() => navigate(`/director/${emp.id}`, { state: { automatic: true } })}
                    >
                      {emp.name}
                    </td>
                    <td style={{ padding: "14px", color: "#4b5563" }}>{emp.din || "N/A"}</td>
                    <td style={{ padding: "14px", color: "#4b5563" }}>{emp.designation || "N/A"}</td>
                    <td style={{ padding: "14px", color: "#4b5563" }}>{formatMonthYear(emp.appointmentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDetails;