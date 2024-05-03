import {
  HrManagerFeedbackSubmissions,
  ProjectManagerFeedbackSubmissions,
} from "../schemas/useCaseSchema.js";

const employeePerformanceHistory = async (req, res) => {
  const { role, email, month } = req.body;
  console.log(req.body)
  try {
    if (role === "Project Manager") {
      const existingFilledForm =
        await ProjectManagerFeedbackSubmissions.findOne({
          employeeEmail: email,
          submissionDate: month,
        });
      if (existingFilledForm) {
        res.status(200).json({
          success: true,
          data: existingFilledForm.ratings,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "performance data not found for the specified month.",
        });
      }
    } else if (role === "HR Manager") {
      const existingFilledForm = await HrManagerFeedbackSubmissions.findOne({
        employeeEmail: email,
        submissionDate: month,
      });
    //   console.log(existingFilledForm)
      if (existingFilledForm) {
        res.status(200).json({
          success: true,
          data: existingFilledForm.ratings,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "performance data not found for the specified month.",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid role provided.",
      });
    }
  } catch (error) {
    console.log("Error fetching performance history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export { employeePerformanceHistory };
