import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EmployeeDashboard.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import MainDisplay from "../../components/Dashboard/MainDisplay.js";
import WelcomeBox from "../../components/Dashboard/WelcomeBox.js";
import QuoteBox from "../../components/Dashboard/QuoteBox.js";
import DoughnutChart from "../../components/Dashboard/Doughnutchart.js";
import LineChart from "../../components/Analytics/LineChart.js";
import ImportantTimelines from "../../components/ImportantTimelines/ImportantTimelines.js";
import Dashboard from "../../components/Dashboard/Dashboard.js";
import NotifBar from "../../components/NotifBar/NotifBar.js";

import { generateNotifications } from "../../utils/utils.js";
import {
  fetchUserData,
  getEmployeeId,
  fetchGoalList,
} from "../../utils/employeeUtils.js";
import { getCurrentTimeGreeting } from "../../utils/utils.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleCheck
} from "@fortawesome/free-solid-svg-icons";

function EmployeeHome() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const location = useLocation();
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("");
  const [goalList, setgoalList] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [id, setId] = useState();
  const [notifications, setNotifications] = useState([]);
  const [topThreeGoals, setTopThreeGoals] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [lineChartLabels, setLineChartLabels] = useState([]);
  const [kpiPercentages, setKPIPercentages] = useState([]);

  const email = location.state?.id || "guest";

  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/employeeHome", { state: { id: email } });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { role, employeeName } = await fetchUserData(location.state.id);
        setUserRole(role);
        setEmployeeName(employeeName);
        const employeeId = await getEmployeeId(location.state.id);
        setId(employeeId);
        const fetchedGoalList = await fetchGoalList(employeeId);
        setgoalList(fetchedGoalList);
        const generatedNotifications = generateNotifications( "Employee" ,fetchedGoalList);
        setNotifications(generatedNotifications);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [location.state.id]);

  useEffect(() => {
    const calculateLineChartData = () => {
      const completedGoalsCountByMonth = {};
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const months = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        months.push(date.toLocaleString("default", { month: "short" }));
      }
      months.reverse(); // reversed it to start with the oldest month

      months.forEach((month) => {
        completedGoalsCountByMonth[month] = 0;
      });

      goalList.forEach((goal) => {
        const completionDate = new Date(goal.completionDate);
        if (
          completionDate >= sixMonthsAgo &&
          completionDate <= currentDate &&
          goal.status === "Done"
        ) {
          const month = completionDate.toLocaleString("default", {
            month: "short",
          });
          completedGoalsCountByMonth[month] =
            (completedGoalsCountByMonth[month] || 0) + 1;
        }
      });

      const lineChartData = Object.values(completedGoalsCountByMonth);
      const lineChartLabels = Object.keys(completedGoalsCountByMonth);

      setLineChartData(lineChartData);
      setLineChartLabels(lineChartLabels);
    };

    calculateLineChartData();
  }, [goalList]);

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

  const firstName = employeeName.split(" ")[0];

  const fetchKpiRatings = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchKpiRatings`,
        {
          id: id,
          role: userRole,
          email: location.state.id,
        }
      );
      setKPIPercentages(data.kpiRatings);
    } catch (error) {
      console.error("Error fetching KPI ratings:", error);
    }
  };

  useEffect(() => {
    if (id && userRole) {
      fetchKpiRatings();
    }
  }, [id, userRole]);

  const predefinedColors = [
    "rgb(18, 155, 131)",
    "rgb(40,108,238)",
    "rgb(240,145,81)",
    "rgb(251,180,28)",
  ];

  const kpiComments = [
    { kpi: 'Self-Goals', comment: 'Set clear objectives, prioritize tasks.' },
    { kpi: 'Work Quality', comment: 'Double-check work, seek feedback.' },
    { kpi: 'Punctuality', comment: 'Plan ahead, manage time effectively.' },
    { kpi: 'Efficiency', comment: 'Maximize productivity, optimize processes.' },
    { kpi: 'Teamwork', comment: 'Collaborate effectively, communicate openly.' },
    { kpi: 'Leadership', comment: 'Inspire and guide team members, foster growth.' },
  ];

  const renderLowestKPIs = () => {
    // first sort KPIs by rating in ascending order, then it filters those with rating less than 50%
    const sortedKPIs = kpiPercentages
      .slice()
      .sort((a, b) => a.rating - b.rating);
    const kpisBelowFifty = sortedKPIs.filter((kpi) => kpi.rating < 50);

    let kpiComment = " ";

    // in the case where there are more than three KPIs below 50%, we return all of them
    if (kpisBelowFifty.length >= 3) {

      return kpisBelowFifty.map((kpi, index) => (

        // const kpiComment = kpiComments.find((comment) => comment.kpi === kpi.name);
        <div className="areas-to-improve-kpis-item" key={index}>
          <FontAwesomeIcon icon={faFileCircleCheck} className="areas-to-improve-icon"/>
          <div className="kpi-name-and-comment"> 
            {kpi.name}
          </div>
          <div className="kpi-rating">
            {kpi.rating}%
          </div>
        </div>

      ));
    } else {
      // else, return the overall three lowest percentage KPIs
      const lowestKPIs = sortedKPIs.slice(0, 3);
      return lowestKPIs.map((kpi, index) => (
        <div className="areas-to-improve-kpis-item" key={index} style={{ borderBottom: index === 2 ? '0px' : '1px solid #ccc' }}>
          <FontAwesomeIcon icon={faFileCircleCheck} className="areas-to-improve-icon"/>
          <div className="kpi-name-and-comment"> 
            {kpi.name}
          </div>
          <div className="kpi-rating">
            {kpi.rating}%
          </div>
          {kpiComment = kpiComments.find((item) => item.kpi === kpi.name) && (
          <div className="kpi-comment">{kpiComment}</div>
          )}
        </div>
      ));
    }
  };

  const calculateStatusCounts = () => {
    const statusCounts = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0,
      Overdue: 0,
    };

    // Loop through goalList to count goals in each status category
    goalList.forEach((goal) => {
      const currentDate = new Date();
      const goalDeadline = new Date(goal.date);

      if (goal.status === "To Do" && goalDeadline < currentDate) {
        statusCounts["Overdue"] += 1;
      } else if (goal.status === "In Progress" && goalDeadline < currentDate) {
        statusCounts["Overdue"] += 1;
      } else if (goal.status === "Done") {
        statusCounts.Done += 1;
      } else if (goal.status === "In Progress") {
        statusCounts["In Progress"] += 1;
      } else {
        statusCounts["To Do"] += 1;
      }
    });

    return Object.values(statusCounts);
  };

  useEffect(() => {
    return () => {
      // cleaning up the canvas when the component is unmounted
      const chartContainer = document.getElementById("tasksStatusChart");
      chartContainer && chartContainer.remove();
    };
  }, []);

  // creating an arrays for storing the 3 most recent goals
  var recentThreeGoals = [];
  var personalGoals = [];

  // checking if goalList is an array
  if (Array.isArray(goalList)) {
    // Filtering the goalList array to only include items with own_goal set to true
    // then we map each item to a new object with a title, status and a due_date properties
    personalGoals = goalList
      .filter((item) => item.own_goal === true)
      .map((item) => ({
        title: item.title,
        status: item.status,
        due_date: item.date,
      }));
  } else {
    // if goalList isn't an array, we log an error message
    console.error("'data' is not an array or is undefined.");
  }

  // Exception Handling:
  // check if there are at least 3 personal goals to display
  // if there, we store the last 3 goals in recentThreeGoals array
  // if there aren't we log an error message
  if (personalGoals.length < 3) {
    console.error("Insufficient personal goals to display.");
  } else {
    recentThreeGoals = personalGoals.slice(-3);
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
          <div className="kpis">
            {kpiPercentages.slice(0, 4).map((kpi, index) => (
              <div className="kpi" key={index}>
                <div className="kpi-box">
                  <div className="kpi-metrics">
                    <span className="kpi-name">{kpi.name}</span>
                    <span
                      className="kpi-percentage"
                      style={{
                        color:
                          predefinedColors[index % predefinedColors.length],
                        fontSize: "1rem",
                      }}
                    >
                      {kpi.rating}%
                    </span>
                  </div>
                  <div className="donut-chart">
                    <DoughnutChart
                      percentage={kpi.rating}
                      color={predefinedColors[index % predefinedColors.length]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="my-quarterly-goals-employee">
            <div className="quarterly-goal-employee-heading">
              My Quarterly Goals
            </div>
            <Link
              to="/projManagerHome"
              className="see-more-quarterly-goals-employee"
            >
              See all
            </Link>
            <div className="quarterly-goal-column-headings">
              {/* Column headings for the quarterly goals */}
              <div className="quarterly-goal-Tasks-TaskID">Task ID</div>
              <div className="quarterly-goal-Tasks-Name">Name</div>
              <div className="quarterly-goal-Tasks-Status">Status</div>
              <div className="quarterly-goal-Tasks-Date">Date</div>
            </div>
            {/* Render 1st goal if recentThreeGoals array has at least 1 goal */}
            {recentThreeGoals.length > 0 && (
              <div className="quarterly-goal-Tasks">
                <div className="quarterly-goal-Tasks-TaskID">01</div>
                <div className="quarterly-goal-Tasks-Name">
                  {recentThreeGoals[0].title}
                </div>
                <div className="quarterly-goal-Tasks-Status">
                  {/* Render the status with a specific style based on the goal's status */}
                  {recentThreeGoals[0].status === "To Do" ? (
                    <div className="Task-status-not-started-box">
                      Not Started
                    </div>
                  ) : recentThreeGoals[0].status === "In Progress" ? (
                    <div className="Task-status-in-progress-box">
                      In Progress
                    </div>
                  ) : (
                    <div className="Task-status-completed-box">Completed</div>
                  )}
                </div>
                <div className="quarterly-goal-Tasks-Date">
                  {/* Display only the date part in this format yyyy/mm/dd */}
                  {recentThreeGoals[0].due_date.substring(0, 10)}
                </div>
              </div>
            )}
            {/* Render 2nd goal if recentThreeGoals array has at least 2 goals */}
            {recentThreeGoals.length > 0 && (
              <div className="quarterly-goal-Tasks">
                <div className="quarterly-goal-Tasks-TaskID">02</div>
                <div className="quarterly-goal-Tasks-Name">
                  {recentThreeGoals[1].title}
                </div>
                <div className="quarterly-goal-Tasks-Status">
                  {recentThreeGoals[1].status === "To Do" ? (
                    <div className="Task-status-not-started-box">
                      Not Started
                    </div>
                  ) : recentThreeGoals[1].status === "In Progress" ? (
                    <div className="Task-status-in-progress-box">
                      In Progress
                    </div>
                  ) : (
                    <div className="Task-status-completed-box">Completed</div>
                  )}
                </div>
                <div className="quarterly-goal-Tasks-Date">
                  {recentThreeGoals[1].due_date.substring(0, 10)}
                </div>
              </div>
            )}
            {/* Render 3rd goal if recentThreeGoals array has at least 3 goals */}
            {recentThreeGoals.length > 0 && (
              <div
                className="quarterly-goal-Tasks"
                style={{ borderBottom: "0px solid" }}
              >
                <div className="quarterly-goal-Tasks-TaskID">03</div>
                <div className="quarterly-goal-Tasks-Name">
                  {recentThreeGoals[2].title}
                </div>
                <div className="quarterly-goal-Tasks-Status">
                  {recentThreeGoals[2].status === "To Do" ? (
                    <div className="Task-status-not-started-box">
                      Not Started
                    </div>
                  ) : recentThreeGoals[2].status === "In Progress" ? (
                    <div className="Task-status-in-progress-box">
                      In Progress
                    </div>
                  ) : (
                    <div className="Task-status-completed-box">Completed</div>
                  )}
                </div>
                <div className="quarterly-goal-Tasks-Date">
                  {recentThreeGoals[2].due_date.substring(0, 10)}
                </div>
              </div>
            )}
          </div>
          <div className="tasks-summary">
            <div className="tasks-statistics-container">
              <div className="summary-heading">Task Statistics</div>
              <div className="task-statistics-line-chartt">
                <LineChart data={lineChartData} labels={lineChartLabels} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
            <div className="tasks-status-container">
              <span className="summary-heading">Tasks Status</span>
              <div className="pie-chart-status">
                <Pie
                  data={{
                    labels: [
                      "Not Started",
                      "In Progress",
                      "Completed",
                      "Overdue",
                    ],
                    datasets: [
                      {
                        label: "WDC",
                        data: calculateStatusCounts(),
                        backgroundColor: [
                          "rgb(227,132,155)",
                          "rgb(253,210,119)",
                          "rgb(138,221,216)",
                          "rgb(225,168,144)",
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
            </div>
          </div>
        </div>
        <div className="content2">
          <NotifBar notifications={notifications} />
          <QuoteBox></QuoteBox>
          <ImportantTimelines topThreeGoals={topThreeGoals} style={{ width: "100%", height: "100%" }} />
          <div className="areas-to-improve">
            <div className="areas-to-improve-heading-box">Areas to Improve</div>
            {renderLowestKPIs()}
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default EmployeeHome;
