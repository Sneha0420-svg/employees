import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

/* ==========================================================================
   GET ALL EMPLOYEES
   ========================================================================== */
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   SEARCH EMPLOYEES (NAME / DIN)
   ========================================================================== */
router.get("/search", async (req, res) => {
  try {
    const query = (req.query.query || "").trim();

    if (!query) return res.json([]);

    const employees = await Employee.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { DIN: { $regex: query, $options: "i" } }
      ]
    });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   COMPANY DROPDOWN SEARCH
   ========================================================================== */
router.get("/companies/search", async (req, res) => {
  try {
    const query = (req.query.query || "").trim().toLowerCase();

    const employees = await Employee.find();
    const companyMap = new Map();

    employees.forEach((emp) => {
      const company = emp?.companyDetails?.companyName;
      if (!company) return;

      const key = company.toLowerCase();

      if (!companyMap.has(key)) {
        companyMap.set(key, emp.companyDetails);
      }
    });

    let companies = Array.from(companyMap.values());

    if (query) {
      companies = companies.filter((c) =>
        c.companyName.toLowerCase().includes(query)
      );
    }

    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   COMPANY DETAILS
   ========================================================================== */
router.get("/company/:companyName", async (req, res) => {
  try {
    const companyName = req.params.companyName.trim().toLowerCase();
    const employees = await Employee.find();

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    let companyInfo = null;
    const activeDirectors = [];
    const pastDirectors = [];

    employees.forEach((emp) => {
      const company = emp?.companyDetails?.companyName;

      if (company && company.toLowerCase() === companyName) {
        companyInfo = emp.companyDetails;
      }

      emp.careerHistory?.forEach((c) => {
        const careerCompany = (c.company || "").toLowerCase();

        if (careerCompany === companyName) {
          const director = {
            id: emp._id,
            name: emp.name,
            DIN: emp.DIN,
            designation: c.role,
            appointmentDate: c.joiningDate,
            resigningDate: c.resigningDate || "-",
            status: c.status
          };

          const status = (c.status || "").toLowerCase();

          if (status === "active" || status === "present") {
            activeDirectors.push(director);
          } else {
            pastDirectors.push(director);
          }
        }
      });
    });

    res.json({
      companyInfo,
      activeDirectors,
      pastDirectors
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   DIRECTOR PROFILE (UPDATED WITH STRING NAME FALLBACK)
   ========================================================================== */
router.get("/director/:id", async (req, res) => {
  try {
    const paramId = req.params.id.trim();

    // 1st Pass: Try to find using standard MongoDB Object ID
    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      const employee = await Employee.findById(paramId);
      if (employee) {
        return res.json(employee);
      }
    }

    // 2nd Pass Fallback: If parameter is a plain-text name string (e.g. from manual search bar inputs)
    const employeeByName = await Employee.findOne({
      name: { $regex: `^${paramId}$`, $options: "i" }
    });

    if (!employeeByName) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json(employeeByName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;