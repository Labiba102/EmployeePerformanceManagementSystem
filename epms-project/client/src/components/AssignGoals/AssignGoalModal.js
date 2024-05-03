// this file is a modal that pops up when the user wants to assign a goal to a project manager or employee
// it could either be project manager assigning a goal to an employee or an HR amanger assigning goal to project manager
// made this into a component so that it can be reused in both the cases (difference being the post request and the role of the person setting the goal)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./goalSetting.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AssignEmployeeGoalModal = ({
  showModal,
  closeModal,
  role,
  organizationalObjectives,
}) => {
  // following are the states for the form fields, along with their error states in the case any one of the fields is not filled
  // const role = useSelector(state => state.role);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [org_obj, setOrgObjective] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // this state is used to show error message if the email entered actually exists against any employee
  const [emailAuthentificationError, setEmailAuthentificationError] =
    useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // this function is called when the user wants to close the popup modal, setting all the states to their initial values so that when the user opens it again, he starts afresh
  const handleClose = () => {
    setTitleError("");
    setEmailError("");
    setDescriptionError("");
    setDueDateError("");
    setEmailAuthentificationError("");
    setTitle("");
    setEmail("");
    setDescription("");
    setDueDate("");
    setOrgObjective("");
    closeModal();
  };

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeModal();
    }, 1000);
  };

  //this function gets the ProjManager's ID corresponding to the entered email address, so that the goal can be saved in the goals table with the projManager's's ID, indicating its assigned to him
  const getProjManagerId = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchProjManagerId`,
        { email }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          return data.projManagerId;
        } else {
          console.error("Failed to fetch projManagerId:", data.message);
          return null;
        }
      } else {
        console.error("Failed to fetch projManagerId:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch projManagerId:", error.message);
      setEmailAuthentificationError("Project Manager Email is invalid");
      return null;
    }
  };
  // this function gets the employeeID corresponding to the entered email address, so that the goal can be saved in the goals table with the employee's ID, indicating its assigned to him
  const getEmployeeId = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchEmployeeId`,
        { email }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          return data.employeeId;
        } else {
          console.error("Failed to fetch EmployeeId:", data.message);
          return null;
        }
      } else {
        console.error("Failed to fetch EmployeeId:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch EmployeeId:", error.message);
      setEmailAuthentificationError("Employee Email is invalid");
      return null;
    }
  };

  // this function validates the form fields, using the states set above. if any field is empty, it sets its error state and sets the form as not valid, disallowing the request to go the backend, catering to possible null value crashes
  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Employee email is required");
      isValid = false;
      return;
    } else {
      setEmailError("");
    }

    if (!title) {
      setTitleError("Title is required");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!description) {
      setDescriptionError("Description is required");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!dueDate) {
      setDueDateError("Due date is required");
      isValid = false;
    } else {
      setDueDateError("");
    }

    return isValid;
  };

  //validating the due date for the assigned goal
  const validateDueDateTime = (dueDateTime) => {
    const currentDate = new Date();
    const dueDate = new Date(dueDateTime);
    if (!(dueDate > currentDate))
    {
      setDueDateError("Due date must be greater than the current date and time");
      return;
    }
    else
    {
      setDueDate("");
    }
  
    return dueDate > currentDate;
  };


  // this function is called when the goal form is submitted to save goal to database
  const handleSubmit = async (e) => {
    e.preventDefault();

    // checks if form is valid (either all fields are filled or not)
    if (!validateForm()) {
      return;
    }


    if (role === "HR Manager") {
      //following checks whether the email exists/is valid or not . in case its not, it deos not allow the form to be processed
      const projManagerId = await getProjManagerId(email);
      console.log("ProjmanagerId is :", projManagerId);
      if (projManagerId == null) {
        setEmailAuthentificationError("Employee email is invalid");

      } else {
        setEmailAuthentificationError("");
      }
      //following checks whether the due dat eis valid or not
      if (!validateDueDateTime(dueDate)) {
        setDueDateError("Due date must be greater than the current date and time");
        return;
      }
      else
      {
        setDueDateError("");
      }
    
      // post request to add the goal to the database
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL2}/setProjManagerGoal`,
          {
            projManagerId: projManagerId,
            title: title,
            description: description,
            org_obj: org_obj,
            own_goal: false,
            date: dueDate,
          }
        );

        if (response.status === 200 && response.data.success) {
          console.log("Goal added to Database");
          handleSuccess();
          navigate("/HrManagerHome", { state: { id: location.state.id } });
        } else {
          console.error("Failed to add Goal to DB", response.data.message);
        }
      } catch (error) {
        console.error("Failed to add Goal to DB", error.message);
      }
    } else if (role === "Project Manager") {
      //following checks whether the email exists/is valid or not . in case its not, it deos not allow the form to be processed
      const employeeId = await getEmployeeId(email);
      if (employeeId == null) {
        setEmailAuthentificationError("Employee email is invalid");
        return;
      } else {
        setEmailAuthentificationError("");
      }

      //following checks whether the due date is valid or not
      if (!validateDueDateTime(dueDate)) {
        setDueDateError("Due date must be greater than the current date and time");
        return;
      }
      else
      {
        setDueDateError("");
      }
    
      // post request to add the goal to the database
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL2}/setGoal`, {
          employeeId: employeeId,
          title: title,
          description: description,
          org_obj: org_obj,
          own_goal: false,
          date: dueDate,
        });

        if (response.status === 200 && response.data.success) {
          console.log("Goal added to Database");
          handleSuccess();
          navigate("/projManagerHome", { state: { id: location.state.id } });
        } else {
          console.error("Failed to add Goal to DB", response.data.message);
        }
      } catch (error) {
        console.error("Failed to add Goal to DB", error.message);
      }
    }


  };

  return (
    <div className={`assign-employee-goal-modal ${showModal ? "show" : ""}`}>
      <div className="set-employee-goal-container">
        <div className="set-employee-goal-title">
          <p>
            {role === "HR Manager"
              ? "Create Goal For Project Manager"
              : "Create Goal for Employee"}
          </p>
          {/* <p>Create Goal for Employee</p> */}
          <FontAwesomeIcon
            icon={faXmark}
            className="close-create-employee-goal-icon"
            onClick={handleClose}
          />
        </div>
        {showSuccess && <p className="success-message">Goal Assigned!</p>}
        <form className="set-employee-goal-form" onSubmit={handleSubmit}>
          {role === "HR Manager" ? (
            <div className="set-employee-goal-form-group">
              <label className="set-employee-goal-label">
                Project Manager Email:
              </label>
              <input
                type="text"
                value={email}
                placeholder="Email of project manager"
                className={`set-employee-goal-input ${
                  emailError ? "error" : ""
                } ${emailAuthentificationError ? "error-auth" : ""}`}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}
              {emailAuthentificationError && (
                <p className="error-message">{emailAuthentificationError}</p>
              )}
            </div>
          ) : (
            <div className="set-employee-goal-form-group">
              <label className="set-employee-goal-label">Employee Email:</label>
              <input
                type="text"
                value={email}
                placeholder="Email of employee"
                className={`set-employee-goal-input ${
                  emailError ? "error" : ""
                } ${emailAuthentificationError ? "error-auth" : ""}`}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}
              {emailAuthentificationError && (
                <p className="error-message">{emailAuthentificationError}</p>
              )}
            </div>
          )}
          <div className="set-employee-goal-form-group">
            <label className="set-employee-goal-label">Title:</label>
            <input
              type="text"
              value={title}
              placeholder="Title of Goal"
              className={`set-employee-goal-input ${titleError ? "error" : ""}`}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {titleError && <p className="error-message">{titleError}</p>}
          </div>
          <div className="set-employee-goal-form-group">
            <label className="set-employee-goal-label">Description:</label>
            <input
              type="text"
              value={description}
              placeholder="Brief description of goal"
              className={`set-employee-goal-input ${
                descriptionError ? "error" : ""
              }`}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {descriptionError && (
              <p className="error-message">{descriptionError}</p>
            )}
          </div>
          <div className="set-employee-goal-form-group">
            <label className="set-employee-goal-label">Due Date:</label>
            <input
              type="datetime-local"
              value={dueDate}
              className={`set-employee-goal-input ${
                dueDateError ? "error" : ""
              }`}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            {dueDateError && <p className="error-message">{dueDateError}</p>}
          </div>
          <div className="set-employee-goal-form-group">
            <label className="set-employee-goal-org-obj">
              Organizational Objective:
            </label>
            <select
              value={org_obj}
              onChange={(e) => setOrgObjective(e.target.value)}
              className="set-org-objective"
              required
            >
              <option value="">Select one</option>
              {organizationalObjectives.map((objective, index) => (
                <option key={index} value={objective}>
                  {objective}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button className="set-employee-goal-button" onClick={handleSubmit}>
              Make Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignEmployeeGoalModal;
