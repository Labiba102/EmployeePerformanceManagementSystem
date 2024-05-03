//This file handles login and account making functions

import mongoose from "mongoose";


// For the encryption of passwords
import bcrypt from "bcrypt";

// For authentification
import jwt from "jsonwebtoken";

// The mongoose models we exported in 'actorSchema.js' are imported here
import {
  SuperAdmin,
  HRManager,
  ProjectManager,
  Employee,
} from "../schemas/actorSchema.js";

// A function used to create jsonwebtoken
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
};

// function to handle image upload to firebase
import { uploadImageToFirebase } from "../firebase/firebaseFunctions.js";

// Function to handle user login
const loginUser = async (req, res) => {
  // Extracts email and password
  const { email, password } = req.body;

  try {
    // The next few lines checks in each of the four actor tables to see whether the person trying to log in is an HR manager,
    // a project manager, an employee or the super admin.

    // In case the user email is found in any one of tables, and their password matches, it returns success,
    // along with the role so that the frontend can handle accessed pages and navigate them to their respective dashboards.
    const hrManager = await HRManager.findOne({ email });
    if (hrManager && (await bcrypt.compare(password, hrManager.password))) {
      const token = createToken(hrManager._id);
      return res.status(200).json({ success: true, role: "HRManager", token });
    }

    const projectManager = await ProjectManager.findOne({ email });
    if (
      projectManager &&
      (await bcrypt.compare(password, projectManager.password))
    ) {
      const token = createToken(projectManager._id);
      return res
        .status(200)
        .json({ success: true, role: "ProjectManager", token });
    }

    const superAdmin = await SuperAdmin.findOne({ email });
    if (superAdmin && (await bcrypt.compare(password, superAdmin.password))) {
      const token = createToken(superAdmin._id);
      return res.status(200).json({ success: true, role: "SuperAdmin", token });
    }

    const employee = await Employee.findOne({ email });
    if (employee && (await bcrypt.compare(password, employee.password))) {
      const token = createToken(employee._id);
      return res.status(200).json({ success: true, role: "Employee", token });
    }

    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// For super admin
const makeUserAccount = async (req, res) => {
  // Extracts the following features from the information the super admin enters while making
  // an account for an employee
  const { name, email, password, role, department, profilePicture } = req.body;

  // console.log("Received image data:", profilePicture);

  // Checks if the email already exists in the database
  const [hrManagerResult, projectManagerResult, employeeResult] = await Promise.all([
    HRManager.findOne({ email }),
    ProjectManager.findOne({ email }),
    Employee.findOne({ email }),
  ]);

  if (hrManagerResult || projectManagerResult || employeeResult) {
    return res.status(200).json({ success: false, message: "Email already in use" });
  }
  
  try {
    // This hashes the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";

    // This prepares user data based on the specified role
    const data = {
      name: name,
      email: email,
      password: hashedPassword,
      department: department,
      profileImage: profilePicture,
    };
    // console.log(data);

    // Insert user data into the respective collection based on the role
    if (role === "HR Manager") {
      const user = await HRManager.insertMany([data]);
      const token = createToken(user._id);
      return res.status(200).json({ success: true, token });
    } else if (role === "Project Manager") {
      const user = await ProjectManager.insertMany([data]);
      const token = createToken(user._id);
      return res.status(200).json({ success: true, token });
    } else if (role === "Employee") {
      const user = await Employee.insertMany([data]);
      const token = createToken(user._id);
      return res.status(200).json({ success: true, token });
    }

    // return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export {
    loginUser,
    makeUserAccount,
};