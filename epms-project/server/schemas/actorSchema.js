// this file is to define schemas for our actors (HR Manager, Project Manager, employee and the super admin)
import mongoose from "mongoose";

//hr manager schema
const hrManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
});

// proj manager schema
const projectManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  performanceKpisCurrentMonth: [
    {
      name: { type: String },
      rating: { type: Number },
    },
  ],
  comments: {
    type: Array,
  },
  reviewGiven: {
    type: Boolean,
    default: false,
  },
});

// employee schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  performanceKpisCurrentMonth: [
    {
      name: { type: String },
      rating: { type: Number },
    },
  ],
  comments: {
    type: Array,
  },
  reviewGiven: {
    type: Boolean,
    default: false,
  },
});

// super admin schema
const superAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
  },
});

// the following creates mongoose models based on the schemas
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
const HRManager = mongoose.model("HRManager", hrManagerSchema);
const ProjectManager = mongoose.model("ProjectManager", projectManagerSchema);
const Employee = mongoose.model("Employee", employeeSchema);

// the following simply exports the mongoose models to be used in other parts of the application
export { SuperAdmin, HRManager, ProjectManager, Employee };
