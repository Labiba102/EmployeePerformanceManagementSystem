// This file basically defines the routes for handling various HTTP requests.
// It imports functions from the different files in the model folder to handle the logic for each route.
// We've used the express router and specifies the HTTP method and endpoint for each functionality

import { loginUser, makeUserAccount } from "../model/userAccountHandling.js";
import { fetchHRManagerInfo, fetchProjManagerInfo, fetchEmployeeInfo, fetchEmployeeId, fetchProjManagerId, 
    fetchHrManagerId, fetchDepartmentNameHR, fetchDepartmentNameProjManager, fetchDepartmentNames, 
    fetchEmployeeTeamMembers, fetchTeamInfo, fetchTeamInfoHRManager, fetchAllTeams, getComments } from "../model/fetchNamesAndIDs.js";
import { getStaffList, fetch_goals, fetch_goals_project_manager } from "../model/displayingLists.js";
import { add_employee_goal, add_projmanager_goal, deleteGoal, deleteProjManagerGoal, updateGoalStatus, editGoal } from "../model/goalHandling.js";
import { addCustomizedForm, fetchFeedbackForm, saveRatings, fetchKpiRatings, fetchComments, saveAnonFeedback, saveCommentStatus } from "../model/feedbackHandling.js";
import { makeTeam, fetchTeam, deleteTeam } from "../model/teamHandling.js";
import { calculateAssignedCount } from "../model/organizationalObjectives.js";
import { employeePerformanceHistory } from "../model/employeeHistory.js";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the landing page");
});

// This simply handles the process of any actor logging in
router.post("/login", loginUser);

// This route is defined for the super admin to be able to make accounts for all employees
router.post("/makeUserAccount", makeUserAccount);

// The following are used to fetch names and roles of the actors so that they can be displayed on the screen when they log in.
router.post("/fetchHRManagerInfo", fetchHRManagerInfo);
router.post("/fetchProjManagerInfo", fetchProjManagerInfo);
router.post("/fetchEmployeeInfo", fetchEmployeeInfo);

// These routes are used to fetch user id to use as a foreign key in other tables
router.post("/fetchEmployeeId", fetchEmployeeId);
router.post("/fetchProjManagerId", fetchProjManagerId);
router.post("/fetchHrManagerId", fetchHrManagerId);

// These routes are used to add a goal for an employee or a project manager to the database
router.post("/setGoal", add_employee_goal);
router.post("/setProjManagerGoal", add_projmanager_goal);

// This route is used to get all staff's information - (reference: SuperAdmin's dashboard)
router.get("/staffList", getStaffList);

// These routes are used to get all goals for a particular employee or project manager
router.post("/goalListEmployee", fetch_goals);
router.post("/goalListForProjectManager", fetch_goals_project_manager);

// This route is for employees and project managers to be able to delete any goal
router.post("/deleteEmployeeGoal", deleteGoal);
router.post("/deleteProjManagerGoal", deleteProjManagerGoal);

// This route is to update goal status
router.post("/updateGoalStatus", updateGoalStatus);

// This route is to edit an existing goal
router.post("/editGoal", editGoal)

// This route is to get HR Manager's department to be used for feedbackform customization
router.post("/fetchDepartmentNameHR", fetchDepartmentNameHR);

//This route is to save the customized form to Database
router.post("/saveFeedbackForm", addCustomizedForm);

// This route is used to get the saved customized form from the Database corresponding to a department
router.post("/fetchFeedbackForm", fetchFeedbackForm);

// This route is used to get Project Manager's department so that he can fill feedback forms corresponding to his department
router.post("/fetchDepartmentNameProjManager", fetchDepartmentNameProjManager);

// This route is used to get team names for getting team name for project managers and hr managers
router.post("/fetchDepartmentInfo", fetchDepartmentNames)
router.post("/fetchTeamInfo", fetchTeamInfo);
router.post("/fetchTeamInfoHRManager", fetchTeamInfoHRManager);

// This route is used to get an Employee's Team members
router.post("/fetchEmployeeTeamMembers", fetchEmployeeTeamMembers);

// This route is to save the ratings against the employees that were filled in the evaluation form
router.post("/saveRatings", saveRatings);

// This route is to get the KPI ratings and comments corresponding to a project manager after their higher ups fill the evaluation forms
router.post("/fetchKpiRatings", fetchKpiRatings);
router.post("/fetchComments", fetchComments);

//This route is to save team information to the database after HR manager assigns team
router.post("/saveTeamInfo", makeTeam);

// THis route is to calculate the number of assigned employees and project managers for each organizational objective
router.post("/calculateCount", calculateAssignedCount);

// this route is to get the team members under a project manager
router.post("/fetchTeam", fetchTeam);

// This route is to save anonymous feedback by employee to his/her teammates
router.post("/saveAnonFeedback", saveAnonFeedback)

// This route is to fetch all teams that are under an HR manager
router.post("/fetchAllTeams", fetchAllTeams)

// This route is to get all anonymous comments from one department for approval by HR manager
router.post("/getComments", getComments)

// This route is to save anonymous comment status
router.post("/saveApproved", saveCommentStatus)

// This router is used to delete a team from the team table
router.post("/deleteTeam", deleteTeam)

// this route is used to get employee's monthly history
router.post("/fetchPerfomanceHistory", employeePerformanceHistory);

// the exported router is used in the main application file to integrate these routes into the express app.
export default router;
