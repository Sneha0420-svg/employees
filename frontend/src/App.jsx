import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CompanyDetails from "./pages/CompanyDetails";
import DirectorsPage from "./pages/DirectorsPage";

function App() {
  return (
    <>
      {/* Nav bar remains fixed on top across all pages */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<CompanyDetails />} />
        
        {/* Both base searches and deep links use the same page element safely */}
        <Route path="/director/search" element={<DirectorsPage />} />
        <Route path="/director/:id" element={<DirectorsPage />} />
      </Routes>
    </>
  );
}

export default App;