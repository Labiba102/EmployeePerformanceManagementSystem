// This file contains all functions related to goal handling (adding goal, updating a goal, deleting a goal)
import mongoose from "mongoose";

// The mongoose models we exported in 'useCaseSchema.js' are imported here
import {
  Goals,
  ProjManagerGoals,
} from "../schemas/useCaseSchema.js";

//The following function adds a goal to the goal Table
const add_employee_goal = async (req, res) => {
  // Extracting all necessary attributes from body of the request
  const {
    employeeId,
    title,
    description,
    org_obj,
    own_goal,
    date,
    isQuarterly,
  } = req.body;

  try {
    const creationDate = new Date();
    // This prepares data to be inserted in Goals table
    const data = {
      employeeId: employeeId,
      title: title,
      description: description,
      org_objectives: org_obj,
      own_goal: own_goal,
      date: date,
      quarterly: isQuarterly,
      creationDate: creationDate,
    };

    // Insert goal data into the Goals table
    await Goals.insertMany([data]);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: "Error Adding Employee Goal" });
  }
};

//The following function adds Project Manager's goal to the ProjManagerGoals Table
const add_projmanager_goal = async (req, res) => {
  // Extracting all necessary attributes from body of the request
  const {
    projManagerId,
    title,
    description,
    org_obj,
    own_goal,
    date,
    isQuarterly,
  } = req.body;
  try {
    const creationDate = new Date();
    // This prepares data to be inserted in ProjManagerGoals table
    const data = {
      projManagerId: projManagerId,
      title: title,
      description: description,
      org_objectives: org_obj,
      own_goal: own_goal,
      date: date,
      quarterly: isQuarterly,
      creationDate: creationDate,
    };

    // Insert goal data into the ProjManagerGoals table
    await ProjManagerGoals.insertMany([data]);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: "Error adding Project Manager Goal" });
  }
};

const deleteGoal = async (req, res) => {
  const { goalId } = req.body;

  try {
    // when using the deleteOne function, what it does is that it deletes a document and the result.deletedCount property indicates the number of documents deleted (which is used for comparison on successful deletion)
    const result = await Goals.deleteOne({ _id: goalId });

    if (result.deletedCount === 1) {
      return res
        .status(200)
        .json({ success: true, message: "Goal deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found." });
    }
  } catch (error) {
    console.error("Error deleting goal:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error Deleting Goal" });
  }
};

const deleteProjManagerGoal = async (req, res) => {
  const { goalId } = req.body;

  try {
    const result = await ProjManagerGoals.deleteOne({ _id: goalId });

    if (result.deletedCount === 1) {
      return res
        .status(200)
        .json({ success: true, message: "Goal deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found." });
    }
  } catch (error) {
    console.error("Error deleting goal:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error Deleting Goal" });
  }
};

// Express route to update goal status
const updateGoalStatus = async (req, res) => {
  const { goalId, newStatus, role, completionDate } = req.body;

  const updated_status = {
    status: newStatus,
  };

  try {
    if (role === "Employee") {
      await Goals.findByIdAndUpdate(goalId, updated_status);
    } else if (role == "Project Manager") {
      await ProjManagerGoals.findByIdAndUpdate(goalId, updated_status);
    }
    if (newStatus === "Done" && completionDate) {
      if (role === "Employee") {
        await Goals.findByIdAndUpdate(goalId, { completionDate });
      } else if (role === "Project Manager") {
        await ProjManagerGoals.findByIdAndUpdate(goalId, { completionDate });
      }
    }
    res.status(200).json({ success: true, message: "Goal status updated" });
  } catch (error) {
    console.error("Error updating goal status:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating Goal Status" });
  }
};

const editGoal = async (req, res) => {
  const { goalId, title, description, date } = req.body;

  // console.log(req.body);

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = date;

    const result = await Goals.findByIdAndUpdate(goalId, updateData);

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Goal updated successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found." });
    }
  } catch (error) {
    console.error("Error updating goal:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error updating goal." });
  }
};

// The following exports the functions to be used as route handlers in the 'routes.js' file
export {
  add_employee_goal,
  add_projmanager_goal,
  deleteGoal,
  updateGoalStatus,
  deleteProjManagerGoal,
  editGoal,
};
