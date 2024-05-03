import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MeetTeam.css";
import { useLocation, useNavigate } from "react-router-dom";
import pfp1 from "./pfp1_anon.png";
import pfp2 from "./pfp2_anon.png";
import pfp3 from "./pfp3_anon.png";
import pfp4 from "./pfp4_anon.png";
import MeetWholeTeamModal from "./MeetWholeTeamModal.js";

const MeetTheTeam = ({ role }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [UserDepartment, setUserDepartment] = useState("");
  const [ProjectMngrID, setProjectMngrID] = useState("");
  const [showModal, setShowModal] = useState(false);

  // fetches user data -> role to display the team accordingly
  const fetchUserData = useCallback(async () => {
    try {
      let response;
      if (role === "HR Manager") {
        response = await axios.post(
          `${process.env.REACT_APP_URL2}/fetchHRManagerInfo`,
          {
            email: location.state.id,
          }
        );
      } else if (role === "Project Manager") {
        response = await axios.post(
          `${process.env.REACT_APP_URL2}/fetchProjManagerInfo`,
          {
            email: location.state.id,
          }
        );
      }

      if (response && response.status === 200 && response.data.success) {
        const { role } = response.data;
        setUserRole(role);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }, [role, location.state.id]);

  // fetches the department name fror HR manager (because his team will be all the project managers in that department)
  const fetchDeptDataHR = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentNameHR`,
        {
          email: location.state.id,
        }
      );
      if (response.status === 200 && response.data.success) {
        const { department } = response.data;
        setUserDepartment(department);
      } else {
        console.error("Failed to fetch user department");
      }
    } catch (error) {
      console.error("Error fetching user department:", error.message);
    }
  }, [location.state.id]);

  const fetchDeptDataPM = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentNameProjManager`,
        {
          email: location.state.id,
        }
      );

      if (response.status === 200 && response.data.success) {
        const { department } = response.data;
        setUserDepartment(department);
      } else {
        console.error("Failed to fetch user department");
      }
    } catch (error) {
      console.error("Error fetching user department:", error.message);
    }
  }, [location.state.id]);

  // fetches project managers ID so that his team can be fetched from the backend (as team is stored in the form of project manager and employee's id in the schema)
  const fetchPMId = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchProjManagerId`,
        {
          email: location.state.id,
        }
      );

      if (response.status === 200 && response.data.success) {
        // console.log(location.state.id)
        const { projManagerId } = response.data; // Assuming the response contains the project manager's ID
        setProjectMngrID(projManagerId); // Pass the project manager's ID to fetchTeamDataPM
      } else {
        console.error("Failed to fetch project manager's ID");
      }
    } catch (error) {
      console.error("Error fetching project manager's ID:", error.message);
    }
  }, [location.state.id]);

  //  fetches the team for hr managers (project managers in the same department)
  const fetchTeamDataHR = useCallback(
    async (UserDepartment) => {
      // console.log("Deptname", UserDepartment, "role", userRole)
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL2}/fetchTeamInfoHRManager`,
          {
            department: UserDepartment,
            role: userRole,
          }
        );

        if (response.status === 200 && response.data.success) {
          setTeamMembers(response.data.team);
        } else {
          console.error("Failed to fetch team data");
        }
      } catch (error) {
        console.error("Error fetching team data:", error.message);
      }
    },
    [userRole]
  );

  // fetches project managers team (based on the id fetched before)
  const fetchTeamDataPM = useCallback(
    async (ProjectMngrID) => {
      console.log("id", ProjectMngrID);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL2}/fetchTeam`,
          {
            id: ProjectMngrID,
          }
        );

        if (response.status === 200 && response.data.success) {
          setTeamMembers(response.data.teamProjectManager);
        } else {
          console.error("Failed to fetch team data PM");
        }
      } catch (error) {
        console.error("Error fetching team data PM:", error.message);
      }
    },
    [ProjectMngrID]
  );

  // useeffect hook for these functions to be mounted when the page is rendered
  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    } else {
      fetchUserData();
      if (userRole === "HR Manager") {
        fetchDeptDataHR();
      } else if (userRole === "Project Manager") {
        fetchPMId();
      }
    }
  }, [
    location.state,
    navigate,
    fetchUserData,
    userRole,
    fetchDeptDataHR,
    fetchDeptDataPM,
    fetchPMId,
    fetchTeamDataHR,
  ]);

  useEffect(() => {
    console.log(userRole);
    if (userRole === "HR Manager" && UserDepartment !== "") {
      console.error("hi im hr");
      fetchTeamDataHR(UserDepartment);
    }
  }, [userRole, UserDepartment, fetchTeamDataHR]);

  useEffect(() => {
    if (userRole === "Project Manager" && ProjectMngrID !== "") {
      console.error("hi im pm");
      fetchTeamDataPM(ProjectMngrID);
    }
  }, [userRole, ProjectMngrID, fetchTeamDataPM]);

  // the next two depend on whether the user clicks on see all or not. in case he does, a model shows up showing the entire team along with theur roles.
  const handleSeeAll = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const memberImages = [pfp1, pfp2, pfp3, pfp4];

  return (
    <div className="meet-the-team">
      <div className="meet-team-heading">Meet The Team</div>
      <div className="meet-the-team-box">
        {teamMembers.slice(0, 4).map((member, index) => (
          <div className="team-member" key={member._id}>
            <div className="team-member-image">
              <img
                src={memberImages[index]}
                alt="Profile"
                className="image-properties"
              />
            </div>
            <div className="member-details">
              <div className="member-name">
                <p>{member.name}</p>
              </div>
              <div className="member-role">
                <p>{member.role}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="see-more-team" onClick={handleSeeAll}>
          See all
        </div>
      </div>
      {/* Modal */}
      <MeetWholeTeamModal
        teamMembers={teamMembers}
        showModal={showModal}
        closeModal={handleCloseModal}
      />
    </div>
  );
};

export default MeetTheTeam;
