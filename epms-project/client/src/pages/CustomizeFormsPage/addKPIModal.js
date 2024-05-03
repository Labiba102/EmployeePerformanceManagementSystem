import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./addKPIModal.css";

// modal where hr manager adds new kpi and its weightage for a specific department
const AddKPIModal = ({ showModal, closeModal, handleData, added_kpi }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameExistsError, setNameExistsError] = useState("")
  const [weightage, setWeightage] = useState(0);
  const [weightageError, setWeightageError] = useState("");

  const handleClose = () => {
    setNameError("");
    setWeightageError("");
    closeModal();
  };

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!weightage) {
      setWeightageError("Weightage is required");
      isValid = false;
    } else {
      setWeightageError("");
    }

    let name_exists = added_kpi.some(item => item.name === name);
    if (name_exists){
      setNameExistsError("This KPI already exists");
      isValid = false
    } else {
      setNameExistsError("")
    }

    return isValid;
  };

  // This function is called when the goal form is submitted to save goal to database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    handleData(name, weightage);

    closeModal();
  };

  return (
    <div className={`add-kpi-modal ${showModal ? "show" : ""}`}>
      <div className="add-kpi-modal-content">
        <div className="add-kpi-modal-top">
          <p className="add-kpi-modal-title">Add new KPI</p>
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="add-kpi-modal-close-icon"
            onClick={handleClose}
          />
        </div>
        <div className="add-kpi-modal-form" onSubmit={handleSubmit}>
          <div className="add-kpi-form-group">
            <label className="add-kpi-field">Name</label>
            <input
              type="text"
              value={name}
              className={`add-kpi-input ${nameError ? "error" : ""}`}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {nameError && <p className="error-message">{nameError}</p>}
            {nameExistsError && <p className="error-message">{nameExistsError}</p>}
          </div>
          <div className="add-kpi-form-group">
            <label className="add-kpi-field">Weightage</label>
            <input
              type="number"
              value={weightage}
              className={`add-kpi-input ${weightageError ? "error" : ""}`}
              placeholder="Brief weightage of Goal"
              onChange={(e) => setWeightage(parseInt(e.target.value))}
              required
            />
            {weightageError && (
              <p className="error-message">{weightageError}</p>
            )}
          </div>
        </div>
        <div className="add-kpi-form-bottom">
          <div>
            <p className="close-add-kpi-form" onClick={handleClose}>Cancel</p>
          </div>
          <div>
            <button className="add-kpi-button" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </div>
      </div>
      {showModal && <div className="blur-background"></div>}
    </div>
  );
};

export default AddKPIModal;
