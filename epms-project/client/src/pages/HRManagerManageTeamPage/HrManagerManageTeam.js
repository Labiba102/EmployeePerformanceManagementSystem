import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import MakeTeamModal from "./MakeTeamModal";
import DeleteTeamModal from "./DeleteTeamModal";
import "./HRManagerManageTeam.css";


const ManageTeam = () => {
  const role = "HR Manager";
  const [department, setDepartment] = useState("");
  const [deptExists, setDeptExists] = useState(false);
  const [deptInfoExists, setDeptInfoExists] = useState(false)
  const [employees, setEmployees] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [showMakeTeam, setShowMakeTeam] = useState(false);
  const [projManagerIds, setProjManagerIds] = useState([])
  const [teamArray, setTeamArray] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [teamDataExists, setTeamDataExists] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const location = useLocation();

  const getDepartment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentNameHR`,
        { email: location.state.id }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setDepartment(data.department);
          setDeptExists(true);
          // console.log(department)
        } else {
          console.error("Failed to fetch Department Name:", data.message);
          return null;
        }
      } else {
        console.error("Failed to fetch Department Name:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch Department Name:", error.message);
      return null;
    }
  };

  const departmentInfo = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentInfo`,
        { department: department, role: role, type: "ManageTeam" }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          const employeeNames = data.teamEmployee.map((person) => person.email);
          const projManagerNames = data.teamProjectManager.map(
            (person) => person.email
          );
          const projManIds = data.teamProjectManager.map((person) => person._id)
          // console.log(projManIds)
          setProjManagerIds(projManIds)
          setEmployees(employeeNames);
          setProjectManagers(projManagerNames);
          setDeptInfoExists(true)
        } else {
          console.log("Failed to fetch Department Members:", data.message);
        }
      } else {
        console.log("Failed to fetch Department Members:", response.statusText);
      }
    } catch (error) {
      console.log("Failed to fetch Department Members:", error.message);
    }
  };
  
  const filterData = () => {
    const filteredEmployeeEmails = employees.filter(email => !teamArray.some(team => 
      team.employees.some(emp => emp.email === email)))

    const filteredProjManEmails = projectManagers.filter(email => !teamArray.some(team => 
      team.projectManager.email === email))

    console.log(filteredProjManEmails)

    setEmployees(filteredEmployeeEmails)
    setProjectManagers(filteredProjManEmails)
  }

  const getTeams = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchAllTeams`, {projManagers: projManagerIds}
      )

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          console.log(data.TeamArray)
          setTeamArray(data.TeamArray)
          setTeamDataExists(true)
          // filterData();
        } else {
          console.log("Failed to fetch team Names:", data.message);
        }
      } else {
        console.log("Failed to fetch team Names:", response.statusText);
      }

    } catch (error) {
      console.log("Failed to fetch team Names:", error.message);
    }
  }

  const handleDeleteTeam = async (e, team) => {
    e.preventDefault();
    setTeamToDelete(team);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/deleteTeam`, { teamToDelete }
      );

      if (response.status === 200) {
        setTeamArray((prevTeams) => prevTeams.filter((t) => t !== teamToDelete));
        setTeamToDelete(null); // Clear teamToDelete after deletion
        setShowConfirmation(false); // Close the confirmation modal
      } else {
        console.log("Failed to delete team:", response.data.message);
      }
    } catch (error) {
      console.log("Failed to delete team:", error.message);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDepartment(); // Fetch department first
        if (deptExists) {
          await departmentInfo(); // Fetch department info if department exists
        }
        if (deptInfoExists) {
          await getTeams(); // Fetch teams if department info exists
        }
        if (teamDataExists) {
          filterData();
        }

        // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating 3 seconds data loading
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); 
  }, [deptExists, deptInfoExists, teamDataExists]);
  
  const handleMakeTeam = () => {
    if (isDataLoaded) {
      setShowMakeTeam(true); // Open the pop-up only if data is loaded
    } else {
      // Optionally show a message or indicator that data is still loading
      console.log("Data is still loading...");
    }
  };

  const closeMakeTeamModal = () => {
    setShowMakeTeam(false);
  };



  return (
    <SidebarMenu role={role}>
      <div className="page-heading">My Teams</div>
      <div className="subheading-and-button-div">
        <div className="my-teams-subheading">Create teams to assign tasks to groups of coworkers</div>
        <button className="create-new-team-button" onClick={handleMakeTeam}>
          <div className="create-new-team-button-content">
            <FontAwesomeIcon icon={faCirclePlus} className="create-new-team-button-icon"/>
            <div className="create-new-team-button-text">Create new team</div>
          </div>
        </button>
      </div>
      <div className="body-content"></div>
        <div className="display-my-teams">
          {teamArray.map((team, index) => (
            <div className="team-card" key={index}>
              <div className="team-number">Team {index + 1}</div>
                <div className="team-details">
                <div className="proj-manager-div">
                  <div className="proj-manager-heading">Project Manager</div> 
                  <div className="proj-manager-name">{team.projectManager.name}</div>
                  <div className="proj-manager-email">({team.projectManager.email})</div>
                  <button className="delete-team-button" onClick={(e) => handleDeleteTeam(e, team)}>Delete</button>
                </div>
                <div className="employee-heading">Employees</div>
                <div>
                  {Array.isArray(team.employees) && team.employees.length > 0 ? (
                    team.employees.map((employee, empIndex) => (
                      <ul key={empIndex}>
                        <div className="employee-item">
                          {empIndex + 1}. 
                          <span className="employee-name">{employee.name}</span> 
                          (<span className="employee-email">{employee.email}</span>)
                        </div>
                      </ul>
                    ))
                  ) : (
                    <li>No employees found</li>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <MakeTeamModal
        showModal={showMakeTeam}
        closeModal={closeMakeTeamModal}
        projectManagers={projectManagers}
        employees={employees}
        teams={teamArray}
        isDataLoaded={isDataLoaded}
      />
      <DeleteTeamModal
        showModal={showConfirmation}
        handleConfirm={handleConfirmDelete}
        handleClose={handleCloseConfirmation}
      />
    </SidebarMenu>
  );
};

export default ManageTeam;
