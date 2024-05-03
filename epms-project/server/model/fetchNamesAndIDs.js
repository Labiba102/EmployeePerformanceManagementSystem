import mongoose from "mongoose";

// The mongoose models we exported in 'actorSchema.js' are imported here
import {
  SuperAdmin,
  HRManager,
  ProjectManager,
  Employee,
} from "../schemas/actorSchema.js";

import { ProjectTeam } from "../schemas/useCaseSchema.js";

//The following three functions simply fetch the names of the respective actors (made three separate
//routes for them to enhance the speed so that we don't have to look into three tables one by one,
//which would be a problem in case there are a lot of users in the database for each actor).
const fetchHRManagerInfo = async (req, res) => {
  const { email } = req.body;

  try {
    const hrManager = await HRManager.findOne({ email });

    // If the above line fetches the email and stores the instance of the HR Manager in hrManager,
    // is returns the corresponding name to the frontend
    if (hrManager) {
      return res.status(200).json({
        success: true,
        role: "HR Manager",
        hrManagerName: hrManager.name,
        hrManagerDepartment: hrManager.department
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "HR Manager not found",
      });
    }
  } catch (error) {
    console.error("Error fetching HR Manager's name:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchProjManagerInfo = async (req, res) => {
  const { email } = req.body;

  try {
    const projManager = await ProjectManager.findOne({ email });

    if (projManager) {
      return res.status(200).json({
        success: true,
        role: "Project Manager",
        projManagerName: projManager.name,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Proj Manager not found",
      });
    }
  } catch (error) {
    console.error("Error fetching Proj Manager's name:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchEmployeeInfo = async (req, res) => {
  const { email } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    if (employee) {
      return res.status(200).json({
        success: true,
        role: "Employee",
        employeeName: employee.name,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
  } catch (error) {
    console.error("Error fetching Employee's name:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Fetching Employee Id to use it as a foreign key in Other tables
const fetchEmployeeId = async (req, res) => {
  const { email } = req.body;
  try {
    const employee = await Employee.findOne({ email });

    if (employee) {
      return res.status(200).json({
        success: true,
        role: "Employee",
        employeeId: employee._id,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
  } catch (error) {
    console.error("Error fetching Employee's id:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Fetching Project Manager Id to use it as a foreign key in Other tables
const fetchProjManagerId = async (req, res) => {
  const { email } = req.body;

  try {
    const proj_manager = await ProjectManager.findOne({ email });
    // console.log(employee._id)
    if (proj_manager) {
      return res.status(200).json({
        success: true,
        role: "Project Manager",
        projManagerId: proj_manager._id,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Project Manager not found",
      });
    }
  } catch (error) {
    console.error("Error fetching Project Manager's id:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchDepartmentNameHR = async (req, res) => {
  const { email } = req.body;

  try {
    const hrManager = await HRManager.findOne({ email });
    if (hrManager) {
      return res.status(200).json({
        success: true,
        department: hrManager.department,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "HR Manager not found",
      });
    }
  } catch (error) {
    console.error("Error fetching HR Manager's Department:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchDepartmentNameProjManager = async (req, res) => {
  const { email } = req.body;

  try {
    const proj_manager = await ProjectManager.findOne({ email });

    if (proj_manager) {
      return res.status(200).json({
        success: true,
        department: proj_manager.department,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Project Manager not found",
      });
    }
  } catch (error) {
    console.error(
      "Error fetching Project Manager's Department:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchDepartmentNames = async (req, res) => {
  const { department, role, type, id } = req.body;

  try {
    if (role === "HR Manager") {
      //Project Manager of the same department as the HR manager
      const teamProjectManager = await ProjectManager.find({
        department: department,
      }).exec();
      const teamArray = Array.isArray(teamProjectManager)
        ? teamProjectManager
        : []; //Making sure it is in an array format

      //Employees of the same department as the HR manager (needed when HR manager is assigning team)
      const teamEmployee = await Employee.find({
        department: department,
      }).exec();
      const employeeTeamToArray = Array.isArray(teamEmployee)
        ? teamEmployee
        : [];

      console.log(teamEmployee);
      if (type === "EvalForm") {
        if (teamProjectManager) {
          return res.status(200).json({
            success: true,
            teamProjectManager: teamArray,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "Team not found",
          });
        }
      } else if (type === "ManageTeam") {
        if (teamProjectManager && teamEmployee) {
          return res.status(200).json({
            success: true,
            teamProjectManager: teamArray,
            teamEmployee: employeeTeamToArray,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "Team not found",
          });
        }
      }
    } else if (role === "Project Manager") {
      // console.log("here")
      const projectTeam = await ProjectTeam.findOne({
        projManagerId: id,
      })
        .populate("teamMembers.employeeId", "name email reviewGiven")
        .exec();
      if (!projectTeam) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      const teamArray = projectTeam.teamMembers.map((member) => ({
        name: member.employeeId.name,
        email: member.employeeId.email,
        reviewGiven: member.employeeId.reviewGiven,
      }));

      return res.status(200).json({
        success: true,
        teamProjectManager: teamArray,
      });
    }

    //else condition for project manager
  } catch (error) {
    console.error("Error fetching team info:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchHrManagerId = async (req, res) => {
  const { email } = req.body;

  try {
    const hr_manager = await HRManager.findOne({ email });
    if (hr_manager) {
      return res.status(200).json({
        success: true,
        role: "Hr Manager",
        hrManagerId: hr_manager._id,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "HR Manager not found",
      });
    }
  } catch (error) {
    console.error("Error fetching HR Manager's id:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchEmployeeTeamMembers = async (req, res) => {
  const {email} = req.body

  try {
    const employee = await Employee.findOne({email: email});

    if (employee) {
      const teamMembersIds = await ProjectTeam.findOne({"teamMembers.employeeId": {$in: [employee._id]}})
      .populate("projManagerId")
      .populate("teamMembers.employeeId");

      // console.log(teamMembersIds)

      if (teamMembersIds) {
          // const projManagerInfo = await ProjectManager.findOne({_id: teamMembersIds.projManagerId})
          // const employeesInfo = await Employee.findById({$in: [teamMembersIds.teamMembers.employeeId]})        

          return res.status(200).json({
            success: true,
            projectManager: teamMembersIds.projManagerId.email,
            teamMembers: teamMembersIds.teamMembers.map(member => member.employeeId.email),
          });
      } else {
        console.error("Team members data is missing");
        return res.status(404).json({
          success: false,
          message: "Missing Team members data",
        });
      }
    } else {
      console.error("Employee not found with this ID.");
      return res.status(404).json({
        success: false,
        message: "No employee found with this ID.",
      });
    }
  } catch (error) {
    console.error("Error fetching Employee's Team Members:", error.message);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchTeamInfo = async (req, res) => {
  const { department, role } = req.body;
  console.log(department, role);
  try {
    if (role === "HR Manager") {
      // Fetch HR managers, project managers, and employees for the department
      const hrManagers = await HRManager.find({ department })
        .select("name profileImage")
        .exec();
      const projectManagers = await ProjectManager.find({ department })
        .select("name profileImage")
        .exec();
      const employees = await Employee.find({ department })
        .select("name profileImage")
        .exec();

      const hrTeam = hrManagers.map((manager) => ({
        ...manager.toObject(),
        role: "HR Manager",
      }));
      const projectManagerTeam = projectManagers.map((manager) => ({
        ...manager.toObject(),
        role: "Project Manager",
      }));
      const employeeTeam = employees.map((employee) => ({
        ...employee.toObject(),
        role: "Employee",
      }));

      const team = [...hrTeam, ...projectManagerTeam, ...employeeTeam];

      return res.status(200).json({
        success: true,
        team: team,
      });
    } else if (role === "Project Manager") {
      // Fetch HR managers and employees for the department
      const hrManagers = await HRManager.find({ department })
        .select("name profileImage")
        .exec();
      const employees = await Employee.find({ department })
        .select("name profileImage")
        .exec();

      const hrTeam = hrManagers.map((manager) => ({
        ...manager.toObject(),
        role: "HR Manager",
      }));
      const employeeTeam = employees.map((employee) => ({
        ...employee.toObject(),
        role: "Employee",
      }));

      const team = [...hrTeam, ...employeeTeam];

      return res.status(200).json({
        success: true,
        team: team,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }
  } catch (error) {
    console.error("Error fetching team info:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const fetchTeamInfoHRManager = async (req, res) => {
  const { department, role } = req.body;
  try {
    if (role === "HR Manager") {
      // Fetch project managers with the same department
      const projectManagers = await ProjectManager.find({ department })
        .select("name profileImage")
        .exec();

      const projectManagerTeam = projectManagers.map((manager) => ({
        ...manager.toObject(),
        role: "Project Manager",
      }));

      console.error(projectManagerTeam.length)
      return res.status(200).json({
        success: true,
        team: projectManagerTeam,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }
  } catch (error) {
    console.error("Error fetching team info:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchAllTeams = async (req, res) => {
  const {projManagers} = req.body;
  
  try {
    const teamList = await ProjectTeam.find({projManagerId: {$in: projManagers}})
    .populate("projManagerId")
    .populate("teamMembers.employeeId")
    console.log(teamList)
    const teamArray = teamList.map(teammember => ({
      projectManager: {name: teammember.projManagerId.name, email: teammember.projManagerId.email},
      employees: teammember.teamMembers.map(member => ({ name: member.employeeId.name, email: member.employeeId.email }))
    }))
    console.log(teamArray)
    
    return res.status(200).json({
      success: true,
      TeamArray: teamArray
    })
  } catch(error) {
    console.log("Failed to get team list: ", error.message)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

const getComments = async (req, res) => {
  const { department } = req.body;

  try {
    const employees = await Employee.find({ department: department, comments: { $exists: true, $ne: [] } });
    const projManager = await ProjectManager.find({ department: department, comments: { $exists: true, $ne: [] } });

    let combinedComments = [];

    if (employees) {
      employees.forEach(emp => {
        const employeeWithAnonComments = emp.comments.filter(comment => comment.anonymous === true && comment.approved === false);
        const employeeComments = employeeWithAnonComments.map(comment => ({ userId: emp._id, role : "Employee", comment: comment.comment }));
        combinedComments = combinedComments.concat(employeeComments);
      });
    }

    if (projManager) {
      projManager.forEach(pm => {
        const projManWithAnonComments = pm.comments.filter(comment => comment.anonymous === true && comment.approved === false);
        const projManComments = projManWithAnonComments.map(comment => ({ userId: pm._id, role: "Project Manager", comment: comment.comment}));
        combinedComments = combinedComments.concat(projManComments);
      });
    }

    return res.status(200).json({
      success: true,
      commentsToApprove: combinedComments
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



export {
  fetchHRManagerInfo,
  fetchProjManagerInfo,
  fetchEmployeeInfo,
  fetchEmployeeId,
  fetchProjManagerId,
  fetchDepartmentNameHR,
  fetchDepartmentNameProjManager,
  fetchDepartmentNames,
  fetchEmployeeTeamMembers,
  fetchTeamInfo,
  fetchTeamInfoHRManager,
  fetchHrManagerId,
  fetchAllTeams,
  getComments
}