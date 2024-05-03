//This file is to define schemas for our use cases i.e., Feedback form and goal setting
import mongoose from "mongoose";

//Feedback form template to be set by hr manager
const feedbackFormTemplateSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  base_kpis: [
    {
      name: { type: String, required: true },
      weightage: { type: Number, required: true, default: 0 },
    },
  ],
  added_kpis: [
    {
      name: { type: String, required: true },
      weightage: { type: Number, required: true, default: 0 },
    },
  ],
  comments_enabled: {
    type: Boolean,
    required: true,
  },
});

// this is to store the feedback form submission given by project manager to the employees in his team
const projectManagerFeedbackSubmissionsSchema = new mongoose.Schema({
  employeeEmail: {
    type: String,
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reviewPeriod: {
    type: String,
    required: true,
  },
  ratings: {
    type: Object,
    required: true,
  },
  comments: {
    type: String,
    default: "",
  },
  submissionDate: {
    type: String,
    default: "",
  },
});

// this is to store the feedback form submission given by an hr manager to the project managers in his department
const HrManagerFeedbackSubmissionsSchema = new mongoose.Schema({
  employeeEmail: {
    type: String,
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reviewPeriod: {
    type: String,
    required: true,
  },
  ratings: {
    type: Object,
    required: true,
  },
  comments: {
    type: String,
    default: "",
  },
  submissionDate: {
    type: String,
    default: "",
  },
});

const projectTeam = new mongoose.Schema({
  projManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectManager",
    required: true,
  },
  teamMembers: [
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    },
  ],
});

//Goal setting schema --> Employee will set goals and they will be stored in this table
const goalSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  org_objectives: {
    type: String,
  },
  own_goal: {
    type: Boolean,
    required: true,
  },
  date: {
    //Deadline
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "To Do",
  },
  quarterly: {
    type: Boolean,
  },
  completionDate: {
    type: Date,
  },
  creationDate: {
    type: Date,
  },
});

//Goal setting schema --> Project Manager will set goals and they will be stored in this table
const projManager_GoalSchema = new mongoose.Schema({
  projManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project Manager",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  org_objectives: {
    type: String,
  },
  own_goal: {
    type: Boolean,
    required: true,
  },
  date: {
    //Deadline
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "To Do",
  },
  quarterly: {
    type: Boolean,
  },
  completionDate: {
    type: Date,
  },
  creationDate: {
    type: Date,
  },
});

const FeedbackForm = mongoose.model("FeedbackForm", feedbackFormTemplateSchema);
const ProjectManagerFeedbackSubmissions = mongoose.model(
  "ProjectManagerFeedbackSubmissions",
  projectManagerFeedbackSubmissionsSchema
);
const HrManagerFeedbackSubmissions = mongoose.model(
  "HrManagerFeedbackSubmissions",
  HrManagerFeedbackSubmissionsSchema
);
const ProjectTeam = mongoose.model("ProjectTeam", projectTeam);
const Goals = mongoose.model("Goals", goalSchema);
const ProjManagerGoals = mongoose.model(
  "ProjManagerGoals",
  projManager_GoalSchema
);

export {
  FeedbackForm,
  ProjectManagerFeedbackSubmissions,
  HrManagerFeedbackSubmissions,
  ProjectTeam,
  Goals,
  ProjManagerGoals,
};
