import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      fontFamily: "sans-serif", 
      background: "#f8fafc", 
      minHeight: "calc(100vh - 70px)", 
      paddingBottom: "60px" 
    }}>
      {/* HERO HERO BANNER SECTION */}
      <div style={{
        background: "linear-gradient(135deg, #0b1528 0%, #1e1b4b 100%)",
        color: "#ffffff",
        padding: "80px 24px",
        textAlign: "center",
        boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          margin: "0 0 16px 0", 
          fontWeight: "800",
          letterSpacing: "-0.5px"
        }}>
          Corporate Profile & Information Portal
        </h1>
        <p style={{ 
          fontSize: "1.25rem", 
          color: "#94a3b8", 
          maxWidth: "700px", 
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          Instantly verify registration information, explore corporate metadata structures, track active current directors, and map cross-organizational employment history paths.
        </p>
      </div>

      {/* CORE FUNCTIONALITY SELECTION TILES */}
      <div style={{
        maxWidth: "1100px",
        margin: "-40px auto 0 auto",
        padding: "0 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "32px"
      }}>
        
        {/* Company Card Component Option */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.2s ease"
        }}>
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏢</div>
            <h2 style={{ color: "#0f172a", margin: "0 0 12px 0", fontSize: "1.5rem", fontWeight: "700" }}>
              Company Registry Search
            </h2>
            <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: "1.5", margin: "0 0 24px 0" }}>
              Look up corporate files by name or unique Identification Numbers (**CIN**). View structural profiles, industries, descriptions, and current leadership matrices.
            </p>
          </div>
          <button 
            onClick={() => navigate("/company")}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)"
            }}
          >
            Open Company Registry &rarr;
          </button>
        </div>

        {/* Director Card Component Option */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.2s ease"
        }}>
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>👤</div>
            <h2 style={{ color: "#0f172a", margin: "0 0 12px 0", fontSize: "1.5rem", fontWeight: "700" }}>
              Director Profiles Search
            </h2>
            <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: "1.5", margin: "0 0 24px 0" }}>
              Search profiles by Director Identification Numbers (**DIN**) or plain-text names. Inspect official contact records and active corporate career histories.
            </p>
          </div>
          <button 
            onClick={() => navigate("/director/search")}
            style={{
              background: "#4c1d95",
              color: "#ffffff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0 4px 6px -1px rgba(76,29,149,0.2)"
            }}
          >
            Open Director Search &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;