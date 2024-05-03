import { ProjectTeam } from "../schemas/useCaseSchema.js";

import { Employee, ProjectManager } from "../schemas/actorSchema.js";

const makeTeam = async (req, res) => {
  try {
    const { projectManager, employees } = req.body;

    //Get project manager id to save it in db
    const projManagerid = await ProjectManager.findOne({
      email: projectManager,
    }).then((projectManager) => projectManager._id);
    // console.log(projManagerid)

    //Get employee ids to save it in db
    const employeeIds = await Promise.all(
      employees.map((email) =>
        Employee.findOne({ email }).then((employee) => employee._id)
      )
    );

    const newProjectTeam = new ProjectTeam({
      projManagerId: projManagerid,
      teamMembers: employeeIds.map((employeeId) => ({ employeeId })),
    });

    await newProjectTeam.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error Saving Project Team in DB" });
  }
};

const fetchTeam = async (req, res) => {
  const { id } = req.body;
  try {
    const projectTeam = await ProjectTeam.findOne({
      projManagerId: id,
    })
      .populate("teamMembers.employeeId", "name email department reviewGiven")
      .exec();
    if (!projectTeam) {
      console.log("i dont have team?")
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const teamArray = projectTeam.teamMembers.map((member) => ({
      name: member.employeeId.name,
      email: member.employeeId.email,
      department: member.employeeId.department,
      role: "Employee",
      reviewGiven: member.employeeId.reviewGiven,
    }));

    return res.status(200).json({
      success: true,
      teamProjectManager: teamArray,
    });
  } catch (error) {
    console.error("Error fetching team info:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteTeam = async (req,res) => {
  const {teamToDelete} = req.body
  try {
    const projMan = await ProjectManager.findOne({email: teamToDelete.projectManager.email})
    // when using the deleteOne function, what it does is that it deletes a document and the result.deletedCount property indicates the number of documents deleted (which is used for comparison on successful deletion)
    const result = await ProjectTeam.deleteOne({ projManagerId : projMan._id });

    if (result.deletedCount === 1) {
      return res
        .status(200)
        .json({ success: true, message: "Team deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Team not found." });
    }
  } catch (error) {
    console.error("Error deleting Team:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error Deleting Team" });
  }
}

export { makeTeam, fetchTeam, deleteTeam };
