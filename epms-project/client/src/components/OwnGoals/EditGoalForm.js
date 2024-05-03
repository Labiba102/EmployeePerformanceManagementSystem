import React, { useState, useEffect } from "react";
import axios from "axios";
import "./kanban_goal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const EditGoalForm = ({ role, showModal, closeModal, goal }) => {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [isQuarterly, setIsQuarterly] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setDescription(goal.description || "");
      setDueDate(goal.date || "");
      setIsQuarterly(goal.quarterly || false);
    }
  }, [goal]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Update the apiUrl to point to the appropriate endpoint for editing a goal
      const apiUrl = `${process.env.REACT_APP_URL2}/editGoal`;
      // Include the goalId in the requestData
      const requestData = {
        goalId: goal._id, // Use _id instead of id
        title: title,
        description: description,
        date: dueDate,
      };

      // Send a POST request to the backend API
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
            {"Edit Goal"}
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
            <button className="self-goal-button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      {showModal && <div className="blur-background"></div>}
    </div>
  );
};

export default EditGoalForm;
