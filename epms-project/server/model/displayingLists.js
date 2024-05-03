//This file handles all functions where data is being extracted from DB to be displayed in the frontend
import mongoose from "mongoose";

// The mongoose models we exported in 'actorSchema.js' are imported here
import {
  HRManager,
  ProjectManager,
  Employee,
} from "../schemas/actorSchema.js";

// The mongoose models we exported in 'useCaseSchema.js' are imported here
import { Goals, ProjManagerGoals } from "../schemas/useCaseSchema.js";

//The following gets staff list from database
const getStaffList = async (req, res) => {
  try {
    //Fetching employee, hr manager and project lead info
    const employees = await Employee.find({}, "name email department")
      .lean()
      .exec();
    const hrManagers = await HRManager.find({}, "name email department")
      .lean()
      .exec();
    const projectManagers = await ProjectManager.find(
      {},
      "name email department"
    )
      .lean()
      .exec();

    // Add role field to each staff member
    employees.forEach((employee) => (employee.role = "Employee"));
    hrManagers.forEach((hrManager) => (hrManager.role = "HR Manager"));
    projectManagers.forEach(
      (projectManager) => (projectManager.role = "Project Lead")
    );

    // Combine all staff members into one array
    const staffList = [...employees, ...hrManagers, ...projectManagers];
    return res.status(200).json({ success: true, staffList });
  } catch (error) {
    // Handle error
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error Getting Staff List" });
  }
};

// This function looks through Employee Goal setting table and returns Employee Goal list
const fetch_goals = async (req, res) => {
  const { id } = req.body;
  try {
    const goals = await Goals.find({ employeeId: id }).exec();
    const goalsArray = Array.isArray(goals) ? goals : [];

    return res.status(200).json({ success: true, goals: goalsArray });
  } catch (error) {
    console.error("Error fetching goal list:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error Getting Goal List" });
  }
};

const fetch_goals_project_manager = async (req, res) => {
  const { id } = req.body;
  try {
    const goals = await ProjManagerGoals.find({ projManagerId: id }).exec();
    const goalsArray = Array.isArray(goals) ? goals : [];
    return res.status(200).json({ success: true, goals: goalsArray });
  } catch (error) {
    console.error("Error fetching goal list:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error Getting Goal List" });
  }
};

export { getStaffList, fetch_goals, fetch_goals_project_manager };
