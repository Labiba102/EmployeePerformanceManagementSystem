// this is a component for the evaluation form (compoenent so that it can be reused in both the project manager and hr manager views)
import React, { useState, useEffect } from "react";
import axios from "axios";
import pic from "./ratings.png";
import "./EvaluationForm.css";
import { useLocation, useNavigate } from "react-router-dom";

const EvaluationForm = ({ role, department }) => {
  // role prop is passed to be able to fetch the users under the specific role, and then display them in the dropdowns
  // department prop is passed to fetch the feedback form for that specific department

  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState(""); // to store id for proj manager to get the team of employees under him
  const [base_kpis, set_base_kpis] = useState([]); // list of kpis that are common for all departments
  const [added_kpis, set_added_kpis] = useState([]); // list of kpis that are specific to the department
  const [commentsEnabled, setCommentsEnabled] = useState(false); // whether comments are enabled for the eval form for that department to check whether to display the comments section or not
  const [names, setNames] = useState([]); // list of team names
  const [emailIds, setEmailIds] = useState([]); //list of email ids of team members
  const [formExists, setFormExists] = useState(false); //boolean to check if form the form is fetched
  const [ratings, setRatings] = useState({}); //to store ratings for each kpi
  const [employeeEmail, setEmployeeEmail] = useState(""); //to store the email of the employee for whom the feedback is being filled
  const [reviewPeriod, setReviewPeriod] = useState(""); //to store the review period [monthly, quarterly, yearly
  const [feedbackComment, setFeedbackComment] = useState(""); //to store the feedback comment
  const [reviewerName, setReviewerName] = useState(""); // to store the reviewer's name

  //The next few lines are for error handling of the specific field
  const [emailError, setEmailError] = useState("");
  const [reviewPeriodError, setReviewPeriodError] = useState("");
  const [reviewerNameError, setReviewerNameError] = useState("");
  const [ratingsError, setRatingError] = useState("");

  // this fetches feedback form data based on department when the 'department' prop changes (in case multiple people from different departments are using the form)
  useEffect(() => {
    const getFormIfExists = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL2}/fetchFeedbackForm`,
          { department: department }
        );

        if (response.status === 200) {
          const data = response.data;
          if (data.success) {
            // updating state with fetched KPIs and comments availability
            set_base_kpis(data.base_kpis);
            set_added_kpis(data.added_kpis);
            // console.log(data.comments_enabled);
            setCommentsEnabled(data.comments_enabled);
            setFormExists(true);
          } else {
            console.log("Failed to fetch Feedback Form:", data.message);
          }
        } else {
          console.log("Failed to fetch Feedback Form:", response.statusText);
        }
      } catch (error) {
        console.log("Failed to fetch Feedback Form:", error.message);
      }
    };

    if (department) {
      getFormIfExists();
    }
  }, [department]);

  const reviewPeriods = ["Monthly", "Quarterly", "Yearly"];

  useEffect(() => {
    // Fetch Project Manager's ID if the role is "Project Manager"
    if (role === "Project Manager") {
      try {
        const fetchProjManagerId = async () => {
          const response = await axios.post(
            `${process.env.REACT_APP_URL2}/fetchProjManagerId`,
            { email: location.state.id }
          );

          if (response.status === 200) {
            const data = response.data;
            if (data.success) {
              setId(data.projManagerId);
            } else {
              console.error("Failed to fetch Proj Manager Id:", data.message);
            }
          } else {
            console.error(
              "Failed to fetch Proj Manager Id:",
              response.statusText
            );
          }
        };

        fetchProjManagerId();
      } catch (error) {
        console.error("Failed to fetch Proj Manager Id:", error.message);
      }
    } else if (role === "HR Manager") {
      try {
        const fetchHrManagerId = async () => {
          const response = await axios.post(
            `${process.env.REACT_APP_URL2}/fetchHrManagerId`,
            { email: location.state.id }
          );

          if (response.status === 200) {
            const data = response.data;
            if (data.success) {
              setId(data.hrManagerId);
            } else {
              console.error("Failed to fetch HR Manager Id:", data.message);
            }
          } else {
            console.error(
              "Failed to fetch HR Manager Id:",
              response.statusText
            );
          }
        };

        fetchHrManagerId();
      } catch (error) {
        console.error("Failed to fetch HR Manager Id:", error.message);
      }
    }
  }, [role, location.state.id]);

  // Call teamInfo function when department, role, and id are defined
  useEffect(() => {
    if (department && role && id) {
      teamInfo();
    }
  }, [department, role, id]);

  // Fetch team info from backend (for whom feedback can be filled)
  const teamInfo = async () => {
    try {
      let postData = { department, role, type: "EvalForm" };

      // Include the project manager's ID if the role is "Project Manager"
      if (role === "Project Manager") {
        postData.id = id;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentInfo`,
        postData
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          const filteredNames = [];
          const filteredEmails = [];
          data.teamProjectManager.forEach((person) => {
            if (!person.reviewGiven) {
              filteredNames.push(person.name);
              filteredEmails.push(person.email);
            }
          });
          setNames(filteredNames);
          setEmailIds(filteredEmails);
        } else {
          console.log("Failed to fetch team Names:", data.message);
        }
      } else {
        console.log("Failed to fetch team Names:", response.statusText);
      }
    } catch (error) {
      console.log("Failed to fetch team Names:", error.message);
    }
  };

  // this is to get the name of the reviewer (HR Manager or Project Manager) based on the role of the user
  const fetchManagerInfo = async () => {
    try {
      const response = await axios.post(
        role === "HR Manager"
          ? `${process.env.REACT_APP_URL2}/fetchHRManagerInfo`
          : `${process.env.REACT_APP_URL2}/fetchProjManagerInfo`,
        { email: location.state.id }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setReviewerName(
            role === "HR Manager" ? data.hrManagerName : data.projManagerName
          );
        } else {
          console.log("Failed to fetch manager info:", data.message);
        }
      } else {
        console.log("Failed to fetch manager info:", response.statusText);
      }
    } catch (error) {
      console.log("Failed to fetch manager info:", error.message);
    }
  };

  useEffect(() => {
    if (formExists) {
      teamInfo();
      fetchManagerInfo();
    }
  }, [formExists]);

  // this basically updates ratings state with the selected rating for the given kpi
  const handleRatingChange = (kpiName, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [kpiName]: rating,
    }));
  };

  // this function renders score options for a given KPI (from a scale of 1-5)
  const renderScoreOptions = (kpiName) => {
    const scores = [1, 2, 3, 4, 5];
    return scores.map((score) => (
      <label key={score} className="checkbox-container">
        <input
          type="checkbox"
          value={score}
          checked={ratings[kpiName] === score} //this to check if the current score matches the rating for this KPI
          onChange={() => handleRatingChange(kpiName, score)}
        />
      </label>
    ));
  };

  const validateForm = () => {
    let isValid = true;

    if (!employeeEmail) {
      isValid = false;
      setEmailError("This Field is Required");
    } else {
      setEmailError("");
    }

    if (!reviewPeriod) {
      isValid = false;
      setReviewPeriodError("This Field is Required");
    } else {
      setReviewPeriodError("");
    }
    console.log(reviewerName);
    if (!reviewerName) {
      isValid = false;
      setReviewerNameError("This Field is Required");
    } else {
      setReviewerNameError("");
    }

    const total_kpis = added_kpis.length + base_kpis.length;

    if (Object.keys(ratings).length !== total_kpis) {
      isValid = false;
      setRatingError("All fields must be filled");
    } else {
      setRatingError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/saveRatings`,
        {
          reviewerId: id,
          email: employeeEmail,
          role: role === "HR Manager" ? "Project Manager" : "Employee",
          ratings: ratings,
          feedback: {
            anonymous: false,
            comment: feedbackComment,
            approved: true,
          },
          reviewPeriod: reviewPeriod,
          dateFilled: new Date(),
        }
      );

      if (response.status === 200) {
        console.log("Ratings saved successfully");
        const dashboardURL =
          role === "Project Manager" ? "/projManagerHome" : "/HrManagerHome";
        setTimeout(() => {
          navigate(dashboardURL, { state: { id: location.state.id } });
        }, 1000);
      } else {
        console.log("Failed to save ratings:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving ratings:", error.message);
    }
  };

  return (
    <div className="evaluation-form-main">
      <div className="evaluation-form-heading-div">
        <p className="evaluation-form-heading">Feedback Form</p>
      </div>
      <div className="evaluation-form-employee-info">
        <div className="evaluation-form-employee-info-heading">
          Employee Information
        </div>
        <div className="evaluation-form-employee-info-dropdowns">
          <select
            className="employee-info-dropdown"
            onChange={(e) => setEmployeeEmail(e.target.value)}
          >
            <option value="" disabled selected hidden>
              Email ID
            </option>
            {emailIds.map((email, index) => (
              <option key={index} value={email}>
                {email}
              </option>
            ))}
          </select>
          {emailError && (
            <p className="evaluation-form-error-message">{emailError}</p>
          )}
          <select
            className="employee-info-dropdown"
            value={reviewPeriod}
            onChange={(e) => setReviewPeriod(e.target.value)}
          >
            <option value="" disabled selected hidden>
              Review Period
            </option>
            {reviewPeriods.map((period, index) => (
              <option key={index} value={period}>
                {period}
              </option>
            ))}
          </select>
          {reviewPeriodError && (
            <p className="evaluation-form-error-message">{reviewPeriodError}</p>
          )}
          <select className="employee-info-dropdown">
            <option value="" disabled selected hidden>
              Reviewer
            </option>
            <option value={reviewerName}>{reviewerName}</option>
          </select>
          {reviewerNameError && (
            <p className="evaluation-form-error-message">{reviewerNameError}</p>
          )}
        </div>
      </div>
      <div className="evaluation-form-performance-evaluation">
        <div className="evaluation-form-performance-evaluation-heading">
          Performance Evaluation
        </div>
        <div className="performance-evaluation-ratings-pic">
          <img src={pic}></img>
        </div>
        <div className="evaluation-and-comments-div">
          <div className="evaluation-form-rating-kpis">
            <div className="evaluation-form-rating-question">
              <p className="evaluation-form-please-rate">
                Please rate the following <span className="asterisk">*</span>
              </p>
            </div>
            <div className="evaluation-form-kpi-score-to-display">
              {[1, 2, 3, 4, 5].map((score, index) => (
                <div className="kpi-scores-evaluation" key={index}>
                  {score}
                </div>
              ))}
            </div>
            <div className="evaluation-form-kpis-to-rate">
              <div className="evaluation-form-base-kpis">
                {base_kpis.map((kpi, index) => (
                  // <p className="evaluation-form-kpis-heading" key={index}>{kpi.name}</p>
                  <div key={index} className="kpi-item">
                    <p className="evaluation-form-kpis-heading">{kpi.name}</p>
                    {renderScoreOptions(kpi.name)}
                  </div>
                ))}
              </div>
              <div className="evaluation-form-added-kpis">
                {added_kpis.map((kpi, index) => (
                  <div key={index} className="kpi-item">
                    <p className="evaluation-form-kpis-heading">{kpi.name}</p>
                    {renderScoreOptions(kpi.name)}
                  </div>
                ))}
              </div>
            </div>
            {ratingsError && (
              <p className="evaluation-form-error-message">{ratingsError}</p>
            )}
          </div>
          {commentsEnabled ? (
            <div className="evaluation-form-comments">
              <div className="evaluation-form-comments-heading">
                Additional Comments
              </div>
              <div className="evaluation-form-comments-div">
                <textarea
                  className="evaluation-form-comments-textarea"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                ></textarea>
                <button
                  className="submit-evaluation-form-button"
                  onClick={handleSubmit}
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          ) : (
            <div className="evaluation-form-comments-disabled">
              <div className="evaluation-form-comments-heading-disabled">
                Comments Disabled
              </div>
              <div className="evaluation-form-comments-div">
                <textarea
                  className="evaluation-form-comments-textarea-disabled"
                  disabled
                  value={feedbackComment}
                ></textarea>
                <button
                  className="submit-evaluation-form-button"
                  onClick={handleSubmit}
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
