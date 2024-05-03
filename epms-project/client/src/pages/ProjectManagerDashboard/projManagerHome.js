import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PMDashboard.css";
import axios from "axios";
import AssignEmployeeGoalModal from "../../components/AssignGoals/AssignGoalModal.js";
import MainDisplay from "../../components/Dashboard/MainDisplay.js";
import WelcomeBox from "../../components/Dashboard/WelcomeBox.js";
import QuoteBox from "../../components/Dashboard/QuoteBox.js";
import Dashboard from "../../components/Dashboard/Dashboard.js";
import GoalFormModal from "../../components/OwnGoals/GoalFormModal.js";
import NotifBar from "../../components/NotifBar/NotifBar.js";
import ImportantTimelines from "../../components/ImportantTimelines/ImportantTimelines.js";
import { getCurrentTimeGreeting } from "../../utils/utils.js";
import OrganizationalObjectives from "../../components/OrganizationalObjectives/organizationalObjectives.js";
import MeetTheTeam from "../../components/Dashboard/MeetTheTeam/MeetTeams.js";
import {
  fetchUserData,
  getProjManagerId,
  fetchGoalList,
} from "../../utils/projManagerUtils.js";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { generateNotifications } from "../../utils/utils.js";
import ViewTeamProgress from "../../components/TeamProgress/teamProgress.js";


function ProjManagerHome({ organizationalObjectives, goalPercentageIncrease }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [projManagerName, setProjManagerName] = useState("");
  const [showCreateEmployeeGoal, setShowCreateEmployeeGoal] = useState(false);
  const [showCreateOwnGoal, setShowCreateOwnGoal] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [goalList, setgoalList] = useState([]);
  const [topThreeGoals, setTopThreeGoals] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [reviewStatusData, setReviewStatusData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const email = location.state?.id || "guest";

  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/projManagerHome", { state: { id: email } });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  //upon loginfetches goal list, team data, PM data and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { role, projManagerName } = await fetchUserData(
          location.state.id
        );
        setUserRole(role);
        setProjManagerName(projManagerName);
        const projectManagerId = await getProjManagerId(location.state.id);
        setId(projectManagerId);
        const fetchedGoalList = await fetchGoalList(projectManagerId);
        setgoalList(fetchedGoalList);
        const generatedNotifications = generateNotifications("Project Manager", fetchedGoalList, teamData);
        setNotifications(generatedNotifications);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [location.state.id]);

  //upon login fetches the team data for the particular project manager
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const teamResponse = await axios.post(
            `${process.env.REACT_APP_URL2}/fetchTeam`,
            {
              id: id,
            }
          );
          if (teamResponse.status === 200) {
            const data = teamResponse.data;
            if (data.success) {
              setTeamData(data.teamProjectManager);
            }

            const reviewStatusCounts = {
              Completed: 0,
              Pending: 0,
            };

            data.teamProjectManager.forEach((member) => {
              if (member.reviewGiven === true) {
                reviewStatusCounts.Completed++;
              } else if (member.reviewGiven === false) {
                reviewStatusCounts.Pending++;
              }
            });

            setReviewStatusData(reviewStatusCounts);
          } else {
            console.error("Team not found");
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {}, [reviewStatusData]);

  const firstName = projManagerName.split(" ")[0];

  const handlePersonalGoal = async (e) => {
    setShowCreateOwnGoal(true);
  };

  //fiter 3 undone goals to display on home
  useEffect(() => {
    const currentDate = new Date();
    const filteredGoals = goalList.filter(
      (goal) => new Date(goal.date) > currentDate && goal.status !== "Done"
    );
    const sortedGoals = filteredGoals.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const topThree = sortedGoals.slice(0, 3);
    setTopThreeGoals(topThree);
  }, [goalList]);

  //Functions to open close modals and navigation functions
  const closeCreateOwnGoalModal = () => {
    setShowCreateOwnGoal(false);
  };

  const handleCreateEmployeeGoal = () => {
    setShowCreateEmployeeGoal(true);
  };

  const closeCreateEmployeeGoalModal = () => {
    setShowCreateEmployeeGoal(false);
  };

  const LinkToPMEvaluation = () => {
    navigate("/projManagerHome", {
      state: { id: email},
    });
  };

  const LinkToViewTeamProgress = () => {
    navigate("/viewTeamProgress", {
      state: { id: email, role: "Project Manager" },
    });
  };

  return (
    <Dashboard role="Project Manager">
      <div className="homepage">
        <div className="content1">
          <MainDisplay
            firstName={firstName}
            getCurrentTimeGreeting={getCurrentTimeGreeting}
          />
          <WelcomeBox></WelcomeBox>
          <div className="button-wrapper">
            <div className="button-container">
              <button onClick={handleCreateEmployeeGoal}>
                Set Employee Goal
              </button>
              <button onClick={handlePersonalGoal}>Set Personal Goal</button>
              <button onClick={LinkToPMEvaluation}>Placeholder</button>
              <button onClick={LinkToViewTeamProgress}>View Team Progress</button>
            </div>
          </div>
          <OrganizationalObjectives
            organizationalObjectives={organizationalObjectives}
            goalPercentageIncrease={goalPercentageIncrease}
          />
          <MeetTheTeam role={userRole} />
        </div>
        <div className="content2">
        <NotifBar notifications={notifications} />
          <QuoteBox></QuoteBox>
          <ImportantTimelines topThreeGoals={topThreeGoals} />
          <div className="review-status">
            <div className="review-status-heading">Review Status</div>
            {reviewStatusData && (
              <div className="pie-chart-container">
                <Pie
                  data={{
                    labels: Object.keys(reviewStatusData),
                    datasets: [
                      {
                        data: Object.values(reviewStatusData),
                        backgroundColor: [
                          "rgb(138,221,216)",
                          "rgb(253,210,119)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 0,
                        right: 0,
                        bottom: 0,
                      },
                    },
                    plugins: {
                      legend: {
                        position: "right",
                      },
                      labels: {
                        boxWidth: 10,
                      },
                    },
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
          </div>
        </div>
        <AssignEmployeeGoalModal
          showModal={showCreateEmployeeGoal}
          closeModal={closeCreateEmployeeGoalModal}
          role="Project Manager"
          organizationalObjectives={organizationalObjectives}
        />
      </div>
      <GoalFormModal
        role="Project Manager"
        showModal={showCreateOwnGoal}
        closeModal={closeCreateOwnGoalModal}
      />
    </Dashboard>
  );
}

export default ProjManagerHome;
