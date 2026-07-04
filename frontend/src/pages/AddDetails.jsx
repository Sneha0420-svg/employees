import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddDetails.css"


function AddDetails() {
  const [employees, setEmployees] = useState([]);
  const fetchEmployees = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchEmployees();
}, []);
  const [formData, setFormData] = useState({
    name: "",
    DIN: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    nationality: "",
    currentDesignation: "",
    qualification: "",

    companyDetails: {
      companyName: "",
      description: "",
      industry: "",
      location: "",
      cin: "",
      registerNo: "",
    },

    careerHistory: [
      {
        company: "",
        role: "",
        joiningDate: "",
        resigningDate: "",
        status: "",
      },
    ],
  });

  const navigate = useNavigate();

useEffect(() => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    navigate("/login");
  }
}, [navigate]);
  // ================= BASIC INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= COMPANY DETAILS =================
  const handleCompanyChange = (e) => {
    setFormData({
      ...formData,
      companyDetails: {
        ...formData.companyDetails,
        [e.target.name]: e.target.value,
      },
    });
  };

  // ================= CAREER CHANGE (MULTI INDEX) ===================
  const handleCareerChange = (index, e) => {
    const updatedCareer = [...formData.careerHistory];

    updatedCareer[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      careerHistory: updatedCareer,
    });
  };

  // ================= ADD NEW CAREER BLOCK =================
  const addCareer = () => {
    setFormData({
      ...formData,
      careerHistory: [
        ...formData.careerHistory,
        {
          company: "",
          role: "",
          joiningDate: "",
          resigningDate: "",
          status: "",
        },
      ],
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/employees",
        formData
      );

      alert("Employee Added Successfully!");

      // RESET FORM
      setFormData({
        name: "",
        DIN: "",
        gender: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        nationality: "",
        currentDesignation: "",
        qualification: "",

        companyDetails: {
          companyName: "",
          description: "",
          industry: "",
          location: "",
          cin: "",
          registerNo: "",
        },

        careerHistory: [
          {
            company: "",
            role: "",
            joiningDate: "",
            resigningDate: "",
            status: "",
          },
        ],
      });

    } catch (error) {
      console.log(error);
      alert("Failed to save employee.");
    }
  };

  return (
  <div className="page">
    <div className="container">

      <h1 className="heading">Employee Registration</h1>

      <form onSubmit={handleSubmit} className="form">

        {/* ================= EMPLOYEE DETAILS ================= */}
        <div className="card">
          <h2>Employee Details</h2>

          <div className="grid">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <input name="DIN" placeholder="DIN" value={formData.DIN} onChange={handleChange} />
            <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
            <input
  type="text"
  name="dob"
  placeholder="Date Of Birth "
  value={formData.dob}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => {
    if (!e.target.value) e.target.type = "text";
  }}
  onChange={handleChange}
/>
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <select
  name="nationality"
  value={formData.nationality}
  onChange={handleChange}
>
  <option value="">Select Nationality</option>
  <option value="Indian">Indian</option>
  <option value="American">American</option>
  <option value="British">British</option>
  <option value="Canadian">Canadian</option>
  <option value="Australian">Australian</option>
  <option value="Other">Other</option>
</select>
            <input name="currentDesignation" placeholder="Designation" value={formData.currentDesignation} onChange={handleChange} />
            <input name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} />
          </div>
        </div>

        {/* ================= COMPANY DETAILS ================= */}
        <div className="card">
          <h2>Company Details</h2>

          <div className="grid">
            <input name="companyName" placeholder="Company Name" value={formData.companyDetails.companyName} onChange={handleCompanyChange} />
    <div className="description-field">
  <textarea
    name="description"
    placeholder="Description"
    value={formData.companyDetails.description}
    onChange={handleCompanyChange}
    className="description-box"
  />
</div>
            <input name="industry" placeholder="Industry" value={formData.companyDetails.industry} onChange={handleCompanyChange} />
            <input name="location" placeholder="Location" value={formData.companyDetails.location} onChange={handleCompanyChange} />
            <input name="cin" placeholder="CIN" value={formData.companyDetails.cin} onChange={handleCompanyChange} />
            <input name="registerNo" placeholder="Register No" value={formData.companyDetails.registerNo} onChange={handleCompanyChange} />
          </div>
        </div>

        {/* ================= CAREER HISTORY ================= */}
        <div className="card">
          <div className="career-header">
            <h2>Career History</h2>

            <button type="button" className="add-btn" onClick={addCareer}>
              + Add Career
            </button>
          </div>

          {formData.careerHistory.map((career, index) => (
            <div className="career-box" key={index}>

              <div className="grid">
                <input name="company" placeholder="Company"
                  value={career.company}
                  onChange={(e) => handleCareerChange(index, e)} />

                <input name="role" placeholder="Role"
                  value={career.role}
                  onChange={(e) => handleCareerChange(index, e)} />

                <input
  type="text"
  name="joiningDate"
  placeholder="Joining Date"
  value={career.joiningDate}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => {
    if (!e.target.value) e.target.type = "text";
  }}
  onChange={(e) => handleCareerChange(index, e)}
/>

<input
  type="text"
  name="resigningDate"
  placeholder="Resigning Date"
  value={career.resigningDate}
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => {
    if (!e.target.value) e.target.type = "text";
  }}
  onChange={(e) => handleCareerChange(index, e)}
/>

                <select
  name="status"
  value={career.status}
  onChange={(e) => handleCareerChange(index, e)}
>
  <option value="">Select Status</option>
  <option value="Active">Active</option>
  <option value="Resigned">Resigned</option>
</select>
              </div>

            </div>
          ))}
        </div>

        {/* ================= SUBMIT ================= */}
        <button type="submit" className="submit-btn">
          Save Employee
        </button>
        

      </form>
    </div>
    {/* ================= VIEW SECTION ================= */}
<div className="card">
  <h2>Employees Data</h2>

  {employees.map((emp, index) => (
    <div key={index} className="view-box">

      {/* BASIC INFO */}
      <h3>{emp.name}</h3>
      <p><b>DIN:</b> {emp.DIN}</p>
      <p><b>Gender:</b> {emp.gender}</p>
      <p><b>DOB:</b> {emp.dob}</p>
      <p><b>Phone:</b> {emp.phone}</p>
      <p><b>Email:</b> {emp.email}</p>
      <p><b>Address:</b> {emp.address}</p>
      <p><b>Nationality:</b> {emp.nationality}</p>
      <p><b>Designation:</b> {emp.currentDesignation}</p>
      <p><b>Qualification:</b> {emp.qualification}</p>

      {/* COMPANY DETAILS */}
      <h4>Company Details</h4>
      <p><b>companyName: </b>{emp.companyDetails?.companyName}</p>
      <p><b>description: </b>{emp.companyDetails?.description}</p>
      <p><b>industry: </b>{emp.companyDetails?.industry}</p>
      <p><b>location: </b>{emp.companyDetails?.location}</p>
      <p><b>cin: </b>{emp.companyDetails?.cin}</p>
      <p><b>registerNo: </b>{emp.companyDetails?.registerNo}</p>

      {/* CAREER HISTORY */}
      <h4>Career History</h4>

      {emp.careerHistory?.map((c, i) => (
        <div key={i} className="career-view">
          <p><b>Company:</b> {c.company}</p>
          <p><b>Role:</b> {c.role}</p>
          <p><b>Joining:</b> {c.joiningDate}</p>
          <p><b>Resigning:</b> {c.resigningDate}</p>
          <p><b>Status:</b> {c.status}</p>
          <hr />
        </div>
      ))}

    </div>
  ))}
</div>
    
  </div>
  
);
}

export default AddDetails;