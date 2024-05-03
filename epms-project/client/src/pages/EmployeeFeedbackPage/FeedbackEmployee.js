import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import "./EmployeeFeedback.css";
import pic from "./anon.png";

// this is for employees to give anon feedback to the employees in his team, or his project manager to encourange candid communication
function EmployeeFeedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [EmployeeEmails, setEmployeeEmails] = useState([]); // employee's team members' names
  const [ProjManagerEmail, setProjManagerEmail] = useState(""); // storing employee's assigned Proj Manager's name
  const [feedbackComment, setFeedbackComment] = useState(""); // storing the anon feedback comment
  const [feedbackForEmployee, setFeedbackForEmployee] = useState("");
  const [feedbackForProjManager, setFeedbackForProjManager] = useState("");
  const [teamInfoFetched, setTeamInfoFetched] = useState(false);
  const [feedbackForError, setFeedbackForError] = useState("");
  const [feedbackCommentError, setFeedbackCommentError] = useState("");

  // Fetch employee's team members info
  const EmployeeTeamInfo = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchEmployeeTeamMembers`,
        { email: location.state.id }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          const projectManager = data.projectManager;
          const employeesArray = data.teamMembers.filter(
            (email) => email !== location.state.id
          );
          setProjManagerEmail(projectManager);
          setEmployeeEmails(employeesArray);
          setTeamInfoFetched(true);
        } else {
          console.log("Failed to fetch team Names:", data.message);
        }
      } else {
        console.log("Failed to fetch team Names");
      }
    } catch (error) {
      console.log("Failed to fetch team Names");
    }
  };

  useEffect(() => {
    if (!teamInfoFetched) {
      EmployeeTeamInfo();
    }
  }, [location.state.id, teamInfoFetched]);

  const handlesetFeedbackForProjManager = () => {
    setFeedbackForProjManager(ProjManagerEmail);
  };

  const handleSubmitFeedback = async () => {
    // following two are error handling for the form
    if (!feedbackForEmployee && !feedbackForProjManager) {
      setFeedbackForError("This field is required");
      return;
    }

    if (!feedbackComment) {
      setFeedbackCommentError("This field is required");
      return;
    }

    try {
      // based on who the employee is giving anon feedback to, the comment is first shown to the hr manager for approval, and then it is displayed on the analytics page - comments for either the employee or the project manager
      if (feedbackForProjManager) {
        const res = await axios.post(
          `${process.env.REACT_APP_URL2}/saveAnonFeedback`,
          {
            email: feedbackForProjManager,
            comment: feedbackComment,
            role: "Project Manager",
          }
        );

        if (res.status === 200) {
          const data = res.data;
          if (data.success) {
            console.log("Feedback Saved Successfully");
            setFeedbackForProjManager("");
            setFeedbackComment("");
            setFeedbackCommentError("");
            setFeedbackForError("");
            navigate("/employeeHome", { state: { id: location.state.id } });
          } else {
            console.log("Failed to save Anonymous feedback:", data.message);
          }
        } else {
          console.log("Failed to save Anonymous feedback");
        }
      } else if (feedbackForEmployee) {
        const res = await axios.post(
          `${process.env.REACT_APP_URL2}/saveAnonFeedback`,
          {
            email: feedbackForEmployee,
            comment: feedbackComment,
            role: "Employee",
          }
        );

        if (res.status === 200) {
          const data = res.data;
          if (data.success) {
            console.log("Feedback Saved Successfully");
            setFeedbackForEmployee("");
            setFeedbackComment("");
            setFeedbackCommentError("");
            setFeedbackForError("");
          } else {
            console.log("Failed to save Anonymous feedback:", data.message);
          }
        } else {
          console.log("Failed to save Anonymous Feedback");
        }
      }
    } catch (error) {
      console.log("Failed to save Anonymous feedback", error.message);
    }
  };

  return (
    <SidebarMenu role={"Employee"}>
      <div className="employee-anon-feedback-homepage">
        <div className="anon-feedback-form-image">
          <img src={pic} alt="pic" className="anon-feedback-form-img" />
        </div>
        <div className="anon-feedback-form-heading">
          <p>Anonymous Feedback Form</p>
          <div className="anon-feedback-form-heading-underline"></div>
        </div>
        <div className="anon-feedback-for">
          <div className="anon-feedback-for-text">
            <p>Choose who to give feedback to:</p>
          </div>
          <div className="anon-team-list-dropdown">
            <div className="anon-team-list-dropdown-pm">
              <button
                className={`project-manager-selected ${
                  feedbackForProjManager ? "pink-border" : ""
                }`}
                onClick={() => handlesetFeedbackForProjManager()}
              >
                Project Manager
              </button>
            </div>
            <div className="anon-team-list-dropdown-employee">
              <select
                className={`employee-selection-dropdown ${
                  feedbackForEmployee ? "pink-border" : ""
                }`}
                value={feedbackForEmployee}
                onChange={(e) => setFeedbackForEmployee(e.target.value)}
              >
                <option value="" disabled hidden>
                  Employee
                </option>
                {EmployeeEmails.map((email, index) => (
                  <option key={index} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {feedbackForError && (
            <p className="feedback-form-error-message">{feedbackForError}</p>
          )}
        </div>
        <div className="anon-feedback-comment">
          <p className="anon-feedback-comment-label">Add a Comment</p>
          <textarea
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            required
            className="anon-feedback-comment-input"
            placeholder="Write anonymous comment here"
          />
          {feedbackCommentError && (
            <p className="feedback-form-error-message">
              {feedbackCommentError}
            </p>
          )}
        </div>
        <div className="anon-feedback-submit-button">
          <button
            className="anon-feedback-submit"
            onClick={handleSubmitFeedback}
          >
            Submit
          </button>
        </div>
      </div>
    </SidebarMenu>
  );
}

export default EmployeeFeedback;
