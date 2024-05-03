import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./HRDashboard.css";
import feedbacklogo from "./feedbacklogo.png";
import MainDisplay from "../../components/Dashboard/MainDisplay.js";
import AssignEmployeeGoalModal from "../../components/AssignGoals/AssignGoalModal.js";
import MeetTheTeam from "../../components/Dashboard/MeetTheTeam/MeetTeams.js";
import WelcomeBox from "../../components/Dashboard/WelcomeBox.js";
import QuoteBox from "../../components/Dashboard/QuoteBox.js";
import Dashboard from "../../components/Dashboard/Dashboard.js";
import NotifBar from "../../components/NotifBar/NotifBar.js";
import ImportantTimelines from "../../components/ImportantTimelines/ImportantTimelines.js";
import OrganizationalObjectives from "../../components/OrganizationalObjectives/organizationalObjectives.js";
import {
  getCurrentTimeGreeting,
} from "../../utils/utils.js";
import ApproveCommentsModal from "./approveComments.js";


function HrManagerHome({ organizationalObjectives, goalPercentageIncrease }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [hrManagerName, setHrManagerName] = useState("");
  const [hrManagerDept, setHrManagerDepartment] = useState("")
  const [showCreatePMGoal, setShowCreatePMGoal] = useState(false);
  const [showMeetTeam, setShowMeetTeam] = useState(false);
  const [showApproveComments, setShowApproveComments] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const [importantTimelines, setImportantTimelines] = useState([]);
  const [deptExist, setDeptExists] = useState(false);

  const [userRole, setUserRole] = useState("");

  const email = location.state?.id || "guest";

  console.log("Here")
  console.log(location.state)

  const fetchUserData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchHRManagerInfo`,
        {
          email: location.state.id,
        }
      );

      if (response.status === 200 && response.data.success) {
        const { role, hrManagerName, hrManagerDepartment } = response.data;
        console.log(hrManagerDepartment)
        // console.log(role, hrManagerName)
        setUserRole(role);
        setHrManagerName(hrManagerName);
        setHrManagerDepartment(hrManagerDepartment)
        setDeptExists(true)
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    } else {
      fetchUserData();
      setUserId(location.state.id);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const twoWeeksBeforeEndOfMonth = lastDayOfMonth - 14;

    if (currentDate.getDate() >= twoWeeksBeforeEndOfMonth) {
      const dueDate = new Date(
        currentYear,
        currentMonth,
        lastDayOfMonth
      ).toLocaleString();

      const alreadyAdded = notifications.some(
        (notification) => notification.title === "Customize feedback form"
      );

      if (!alreadyAdded) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            title: "Customize feedback form",
            dueDate: dueDate,
          },
        ]);
        setImportantTimelines((prevTimelines) => [
          ...prevTimelines,
          {
            title: "Customize feedback form",
            date: dueDate,
          },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/HrManagerHome", { state: { id: email } });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  const firstName = hrManagerName.split(" ")[0];

  //Handling navigation functionality for onClick used for hr-manager-buttons
  const linkToFeedbackForm = () => {
    navigate("/customizeFeedbackForm", {
      state: { id: email, role: userRole },
    });
  };

  const HandleCreatePMGoals = () => {
    setShowCreatePMGoal(true);
  };

  const closeCreatePMGoalModal = () => {
    setShowCreatePMGoal(false);
  };

  const HandleMeetTeams = () => {
    console.log("Inside handle meet teams!");
    setShowMeetTeam(true);
  };

  const closeMeetTeams = () => {
    setShowMeetTeam(false);
  };

  const LinkToViewTeamProgress = () => {
    navigate("/viewTeamProgress", {
      state: { id: email, role: "HR Manager" },
    });
  };                                              

  const LinkToHRManageTeam = () => {
    navigate("/HRManageTeam", {
      state: { id: email, role: userRole },
    });
  };

  const HandleApproveComments = () => {
    setShowApproveComments(true);
  };

  const closeApproveComments = () => {
    setShowApproveComments(false);
  }

  return (
    <Dashboard role={userRole}>
      <div className="homepage">
        <div className="content1">
          <MainDisplay
            firstName={firstName}
            getCurrentTimeGreeting={getCurrentTimeGreeting}
          />
          <WelcomeBox></WelcomeBox>
          <div className="button-wrapper">
            <div className="button-container">
              <button
                className="hr-manager-buttons"
                onClick={HandleCreatePMGoals}
              >
                Assign Goals
              </button>
              <button
                className="hr-manager-buttons"
                onClick={LinkToViewTeamProgress}
              >
                View Team Progress
              </button>
              <button
                className="hr-manager-buttons"
                onClick={LinkToHRManageTeam}
              >
                Assign Teams
              </button>
              <button
                className="hr-manager-buttons"
                onClick={HandleApproveComments}
              >
                Approve Comments
              </button>
            </div>
          </div>
          <OrganizationalObjectives
            organizationalObjectives={organizationalObjectives}
            goalPercentageIncrease={goalPercentageIncrease}
          />
          <MeetTheTeam role={userRole} />
        </div>
        <div className="content2">
          <NotifBar notifications={notifications}></NotifBar>
          <QuoteBox></QuoteBox>
          <ImportantTimelines
            topThreeGoals={importantTimelines}
          ></ImportantTimelines>
          <div className="configure-forms">
            <div className="configure-forms-heading">Configure Forms</div>
            <div className="configure-form-text">
              Customise <strong>evaluation criteria</strong> for the employees and project managers under
              your supervision. Tailor the form to align with{" "}
              <strong>performance indicators</strong> and organizational goals.
            </div>
            <div className="configure-form-button-img-div">
              <div className="configure-feedbackform-button">
                <button onClick={linkToFeedbackForm}>
                  <p>Configure Feedback Forms</p>
                </button>
              </div>
              <div className="feedbacklogo-image">
                <img
                  src={feedbacklogo}
                  alt="feedbacklogo"
                  className="feedbacklogo-img"
                />
              </div>
            </div>
          </div>
        </div>
        <AssignEmployeeGoalModal
          showModal={showCreatePMGoal}
          closeModal={closeCreatePMGoalModal}
          role={userRole}
          organizationalObjectives={organizationalObjectives}
        />
        <ApproveCommentsModal
          showModal={showApproveComments}
          closeModal={closeApproveComments}
          department={hrManagerDept}
          departmentExists={deptExist}
          email = {email}
        />
        {/* <ViewTeamModal
          showModal={showMeetTeam}
          closeModal={closeMeetTeams}
          role={userRole} 
        /> */}
      </div>
    </Dashboard>
  );
}

export default HrManagerHome;
