import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./kanban_goal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// modal popup for setting own goal (for both employee and project manager)
const GoalFormModal = ({ role, showModal, closeModal, editMode, goalId }) => {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [isQuarterly, setIsQuarterly] = useState(false);
  const location = useLocation();

  // handles the closing of the modal and resets all states
  const handleClose = () => {
    setTitleError("");
    setDescriptionError("");
    setDueDateError("");
    setTitle("");
    setDescription("");
    setDueDate("");
    setIsQuarterly(false);
    closeModal();
  };

  // doesn't submit the form unless all fields are filled
  const validateForm = () => {
    let isValid = true;

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

  // gets the id of the user so that the goal is stored with the id (easier to fetch goal list this way)
  const getUserId = async () => {
    try {
      let apiUrl = "";
      if (role === "Project Manager") {
        apiUrl = `${process.env.REACT_APP_URL2}/fetchProjManagerId`;
      }
      if (role === "Employee") {
        apiUrl = `${process.env.REACT_APP_URL2}/fetchEmployeeId`;
      }

      const response = await axios.post(apiUrl, { email: location.state.id });

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          return role === "Project Manager"
            ? data.projManagerId
            : data.employeeId;
        } else {
          console.error(`Failed to fetch ${role} ID:`, data.message);
        }
      } else {
        console.error(`Failed to fetch ${role} ID:`, response.statusText);
      }
    } catch (error) {
      console.error(`Failed to fetch ${role} ID:`, error.message);
    }
  };

  // handles the submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // doesnt let the form be submitted unless it is validated
    if (!validateForm()) {
      return;
    }

    try {
      let apiUrl = "";
      let requestData = {
        title: title,
        description: description,
        date: dueDate,
      };

      if (editMode) {
        apiUrl = `${process.env.REACT_APP_URL2}/editGoal`;
        requestData.goalId = goalId;
      } else {
        const userId = await getUserId();
        if (role === "Employee") {
          apiUrl = `${process.env.REACT_APP_URL2}/setGoal`;
          requestData.employeeId = userId;
          requestData.org_obj = null;
          requestData.own_goal = true;
          requestData.isQuarterly = isQuarterly;
        } else if (role === "Project Manager") {
          apiUrl = `${process.env.REACT_APP_URL2}/setProjManagerGoal`;
          requestData.projManagerId = userId;
          requestData.org_obj = null;
          requestData.own_goal = true;
          requestData.isQuarterly = isQuarterly;
        }
      }

      const response = await axios.post(apiUrl, requestData);

      if (response.status === 200 && response.data.success) {
        handleClose();
      } else {
        console.error("Failed to add/edit Goal:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to add/edit Goal:", error.message);
    }
  };

  return (
    <div className={`modal ${showModal ? "show" : ""}`}>
      <div className="modal-content">
        <div className="self-goal-form-top">
          <p className="self-goal-form-title">
            {editMode ? "Edit Goal" : "Create Own Goal"}
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            className="close-icon"
            onClick={handleClose}
          />
        </div>
        <form className="self-goal-making-form" onSubmit={handleSubmit}>
          <div className="self-form-group">
            <label className="self-goal-label-description">Title:</label>
            <input
              type="text"
              value={title}
              className={`self-goal-input ${titleError ? "error" : ""}`}
              placeholder="Title of Goal"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {titleError && <p className="error-message">{titleError}</p>}
          </div>
          <div className="self-form-group">
            <label className="self-goal-label-description">
              Goal Description:
            </label>
            <input
              type="text"
              value={description}
              className={`self-goal-description-input ${
                descriptionError ? "error" : ""
              }`}
              placeholder="Brief description of Goal"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {descriptionError && (
              <p className="error-message">{descriptionError}</p>
            )}
          </div>

          <div className="self-form-group">
            <label className="self-goal-label-description">Due Date:</label>
            <input
              type="datetime-local"
              value={dueDate}
              className={`self-goal-input ${dueDateError ? "error" : ""}`}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            {dueDateError && <p className="error-message">{dueDateError}</p>}
          </div>

          <div className="self-form-group-quarterly">
            <input
              type="checkbox"
              checked={isQuarterly}
              onChange={(e) => setIsQuarterly(e.target.checked)}
            />
          </div>
          <label className="self-goal-label-quarterly-description">
            Quarterly goal?
          </label>
          <div className="self-form-group">
            <button className="self-goal-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
      {showModal && <div className="blur-background"></div>}
    </div>
  );
};

export default GoalFormModal;
