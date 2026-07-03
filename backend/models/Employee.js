import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  company: String,
  role: String,
  joiningDate: String,
  resigningDate: String,
  status: String,
});

const companySchema = new mongoose.Schema({
  companyName: String,
  description: String,
  industry: String,
  location: String,
  cin: String,
  registerNo: String,
});

const employeeSchema = new mongoose.Schema({
  name: String,
  DIN: String,
  gender: String,
  dob: String,
  phone: String,
  email: String,
  address: String,
  nationality: String,
  currentDesignation: String,
  qualification: String,

  companyDetails: companySchema,
  careerHistory: [careerSchema],
});

export default mongoose.model("Employee", employeeSchema);

