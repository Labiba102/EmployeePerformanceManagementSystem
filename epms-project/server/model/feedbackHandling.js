import {
  FeedbackForm,
  HrManagerFeedbackSubmissions,
  ProjectManagerFeedbackSubmissions,
  Goals,
  ProjManagerGoals,
} from "../schemas/useCaseSchema.js";

import { Employee, ProjectManager } from "../schemas/actorSchema.js";

const addCustomizedForm = async (req, res) => {
  const { department, base_kpis, added_kpis, comments_enabled } = req.body;

  try {
    // Check if a form with the given department exists
    const existingForm = await FeedbackForm.findOne({ department: department });
    // console.log(existingForm);

    if (existingForm) {
      // Update the existing form with new base_kpis and added_kpis
      existingForm.base_kpis = base_kpis;
      existingForm.added_kpis = added_kpis;
      existingForm.comments_enabled = comments_enabled;
      await existingForm.save();
    } else {
      // Add a new form entry
      const data = {
        department: department,
        base_kpis: base_kpis,
        added_kpis: added_kpis,
        comments_enabled: comments_enabled,
      };
      await FeedbackForm.insertMany([data]);
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: "Error Adding/Updating Form in DB" });
  }
};

const fetchFeedbackForm = async (req, res) => {
  const { department } = req.body;
  // console.log(department)

  try {
    const form = await FeedbackForm.findOne({ department: department });
    // console.log(form);

    if (form) {
      return res.status(200).json({
        success: true,
        base_kpis: form.base_kpis,
        added_kpis: form.added_kpis,
        comments_enabled: form.comments_enabled,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }
  } catch (e) {
    console.error("Error fetching feedback form:", e.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const saveRatings = async (req, res) => {
  try {
    const { reviewerId, email, role, ratings, feedback, reviewPeriod, dateFilled } = req.body;

    const Model = role === "Project Manager" ? ProjectManager : Employee;
    const user = await Model.findOne({ email });

    if (user) {
      user.totalReviews = (user.totalReviews || 0) + 1;

      Object.keys(ratings).forEach((kpiName) => {
        if (
          user.performanceKpisCurrentMonth &&
          user.performanceKpisCurrentMonth.length > 0
        ) {
          const existingRating = user.performanceKpisCurrentMonth.find(
            (kpi) => kpi.name === kpiName
          );
          if (existingRating) {
            existingRating.rating = ratings[kpiName];
          } else {
            user.performanceKpisCurrentMonth.push({
              name: kpiName,
              rating: ratings[kpiName],
            });
          }
        } else {
          user.performanceKpisCurrentMonth = [
            { name: kpiName, rating: ratings[kpiName] },
          ];
        }
      });

      if (feedback) {
        user.comments.push(feedback);
      }

      user.reviewGiven = true;

      const currentMonth = new Date().toLocaleString("default", { month: "long" });

      const feedbackSubmissionData = {
        reviewerId: reviewerId,
        employeeEmail: email,
        reviewerEmail: user.email, 
        reviewPeriod: reviewPeriod,
        ratings: ratings,
        comments: feedback.comment || "",
        submissionDate: currentMonth,
      };

      if (role === "Project Manager") {
        const HrManagerFeedbackSubmission = new HrManagerFeedbackSubmissions(feedbackSubmissionData);
        await HrManagerFeedbackSubmission.save();
      } else if (role === "Employee") {
        const projectManagerFeedbackSubmission = new ProjectManagerFeedbackSubmissions(feedbackSubmissionData);
        await projectManagerFeedbackSubmission.save();
      }

      await user.save();
    } else {
      console.log("User not found");
    }

    return res
      .status(200)
      .json({ success: true, message: "Ratings saved successfully" });
  } catch (error) {
    console.error("Error saving ratings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const fetchKpiRatings = async (req, res) => {
  try {
    const { id, role, email } = req.body;

    const Model = role === "Project Manager" ? ProjectManager : Employee;
    const user = await Model.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Project manager not found" });
    }

    const kpiRatings = user.performanceKpisCurrentMonth.map((kpi) => ({
      name: kpi.name,
      rating: (kpi.rating / 5) * 100,
    }));

    return res.status(200).json({ success: true, kpiRatings });
  } catch (error) {
    console.error("Error fetching KPI ratings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// returns the comments if any that were provided to the user in the evaluation form
const fetchComments = async (req, res) => {
  try {
    const { email, role } = req.body;

    const Model = role === "Project Manager" ? ProjectManager : Employee;
    const user = await Model.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, comments: user.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const saveAnonFeedback = async (req,res) => {
  const {email, comment, role} = req.body
  const feedback = {anonymous: true, comment: comment, approved: false}
  
  try {
    if (role === "Project Manager")
    {
      const projMan = await ProjectManager.findOne({email})
      projMan.comments.push(feedback)
      await projMan.save();
      return res.status(200).json({success: true}) 
    }
    else if (role === "Employee")
    {
      console.log(email)
      const emp = await Employee.findOne({email: email})
      console.log(emp)
      emp.comments.push(feedback)
      await emp.save();
      return res.status(200).json({success: true}) 
    }
  } catch (error) {
    console.log("Failed to save anon feedback", error.message)
  }
}

const saveCommentStatus = async (req, res) => {
  const { comment } = req.body;

  try {
    if (comment.role === "Employee") {
      const employee = await Employee.findOneAndUpdate(
        { _id: comment.userId, "comments.comment": comment.comment },
        { $set: { "comments.$.approved": true } },
        { new: true }
      );

      if (employee) {
        // console.log("In here")
        return res.status(200).json({
          success: true,
          message: "Comment status updated successfully."
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Employee or comment not found."
        });
      }
    } else if (comment.role === "Project Manager") {
      const projManager = await ProjectManager.findOneAndUpdate(
        { _id: comment.userId, "comments.comment": comment.comment },
        { $set: { "comments.$.approved": true } },
        { new: true }
      );

      if (projManager) {
        return res.status(200).json({
          success: true,
          message: "Comment status updated successfully."
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Project Manager or comment not found."
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role provided."
      });
    }
  } catch (error) {
    console.log("Failed to save comment status", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


export {
  addCustomizedForm,
  fetchFeedbackForm,
  saveRatings,
  fetchKpiRatings,
  fetchComments,
  saveAnonFeedback,
  saveCommentStatus
};
