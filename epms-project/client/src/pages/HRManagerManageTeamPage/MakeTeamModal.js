import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./MakeTeamModal.css";

const MakeTeamModal = ({
  showModal,
  closeModal,
  projectManagers,
  employees,
  teams
}) => {
  const [selectedProjectManager, setSelectedProjectManager] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAddEmployeeField, setShowAddEmployeeField] = useState(false);
  const [projManagerError, setProjManagerError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [employeeNullError, setEmployeeNullError] = useState("");
  const [existingProjManError, setExistingProjManError] = useState("")
  const [existingEmployeeError, setExistingEmployeeError] = useState("")
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    setProjManagerError("");
    setEmployeeError("");
    setEmployeeNullError("");
    closeModal();
  };

  const handleAddEmployee = () => {
    setShowAddEmployeeField(true);
  };

  const handleEmployeeChange = (e, index) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index] = e.target.value;
    setSelectedEmployees(updatedEmployees);
  };

  // const checkExisting = () => {
  //   let exists = false;
  //   const existing_projMan = teams.forEach(team => {team.projectManager.email === selectedProjectManager});
  //   const existing_employee = employees.forEach(employee => 
  //     {teams.forEach(team => {team.employees.forEach(emp => {
  //       emp.email === employee.email
  //     })})})

  //   if (existing_projMan)
  //   {
  //     exists = true
  //     setExistingProjManError("Project Manager's Team exists")
  //   }
  //   else
  //   {
  //     setExistingProjManError("")
  //   }
  //   if (existing_employee)
  //   {
  //     exists = true
  //     setExistingEmployeeError("Employee's Team Exists")
  //   }
  //   else
  //   {
  //     setExistingEmployeeError("")
  //   }

  //   return exists;
  // }

  const validateForm = () => {
    let isValid = true;
    if (!selectedProjectManager) {
      isValid = false;
      setProjManagerError("Project Manager selection is required");
    } else {
      setProjManagerError("");
    }

    if (selectedEmployees.length === 0) {
      console.log("here")
      isValid = false;
      setEmployeeNullError("At least one Employee is required");
    } else {
      setEmployeeNullError("");
    }

    const allUniqueEmployees = new Set(selectedEmployees);
    if (allUniqueEmployees.size !== selectedEmployees.length) {
      isValid = false;
      setEmployeeError("Employees should be unique");
    } else {
      setEmployeeError("");
    }

    return isValid;
  };

  // This function is called when the goal form is submitted to save goal to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // if (!checkExisting()) {
    //   return;
    // }

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL2}/saveTeamInfo`, {
        projectManager: selectedProjectManager,
        employees: selectedEmployees,
      });

      if (response.status === 200) {
        setEmployeeError("")
        setProjManagerError("")
        setSelectedEmployees([])
        setSelectedProjectManager("")
        navigate("/HRManageTeam", { state: { id: location.state.id } });
      } else {
        console.error("Failed to add team to DB:", response.statusText);
        return null;
      }
    } catch (e) {
      console.error("Error Saving team to DB:", e.message);
    }
    closeModal();
  };

  return (
    <div className={`make-team-modal ${showModal ? "show" : ""}`}>
      <div className="make-team-modal-content">
        <div className="make-team-modal-top">
          <p className="make-team-modal-title">Make New Team</p>
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="make-team-modal-close-icon"
            onClick={handleClose}
          />
        </div>
        <form className="make-team-modal-form" onSubmit={handleSubmit}>
          <div className="make-team-form-group">
            <select
              className="project-manager-info-dropdown"
              value={selectedProjectManager}
              onChange={(e) => setSelectedProjectManager(e.target.value)}
            >
              <option value="" disabled hidden>
                Project Manager
              </option>
              {projectManagers.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {projManagerError && (
              <p className="make-team-error-message">{projManagerError}</p>
            )}
            {/* {existingProjManError && (
              <p className="make-team-error-message">{existingProjManError}</p>
            )} */}
          </div>
          {selectedEmployees.map((employee, index) => (
            <div key={index} className="make-team-form-group">
              <select
                className="employee-info-dropdown"
                value={employee}
                onChange={(e) => handleEmployeeChange(e, index)}
              >
                <option value="" disabled hidden>
                  Employee
                </option>
                {employees.map((name, empIndex) => (
                  <option key={empIndex} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {employeeNullError && (
            <p className="make-team-error-message">{employeeNullError}</p>
          )}
          {employeeError && (
            <p className="make-team-error-message">{employeeError}</p>
          )}
          {/* {existingEmployeeError && (
              <p className="make-team-error-message">{existingEmployeeError}</p>
          )} */}
          {showAddEmployeeField && ( // Conditionally render the additional employee field
            <div className="make-team-form-group">
              <select
                className="employee-info-dropdown"
                value=""
                onChange={(e) => {
                  setSelectedEmployees([...selectedEmployees, e.target.value]);
                  setShowAddEmployeeField(false); // Hide the additional field after selection
                }}
              >
                <option value="" disabled hidden>
                  Add Employee
                </option>
                {employees.map((name, empIndex) => (
                  <option key={empIndex} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button className="add-employee-button" type="button" onClick={handleAddEmployee}>
            Add Employee
          </button>
          <div className="bottom-bar">
            <p className="close-make-team-form" onClick={handleClose}>
              Cancel
            </p>
            <button className="save-button" type="submit">Save Team</button>
          </div>
        </form>
      </div>
      {showModal && <div className="blur-background"></div>}
    </div>
  );
};

export default MakeTeamModal;
