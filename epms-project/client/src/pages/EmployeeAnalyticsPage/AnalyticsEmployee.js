// comments for Analytics Page
// importing necessary modules & components
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../../images/analytics_quote.png";
import "../../components/Analytics/Analytics.css";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import DoughnutChart from "../../components/Dashboard/Doughnutchart.js";
import TaskstatusChart from "../../components/Dashboard/TaskStatus_Chart.js";
import LineChart from "../../components/Analytics/LineChart.js";
import BarGraph from "../../components/Analytics/BarGraph.js";
import NotifBar from "../../components/NotifBar/NotifBar.js";
// data fetching functions
import {
  fetchUserData,
  getEmployeeId,
  fetchGoalList,
} from "../../utils/employeeUtils.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleCheck
} from "@fortawesome/free-solid-svg-icons";

// state variables for managing user role, employee id, goal list, notifs, and their updates using 'useState' hook
function EmployeeAnalytics() {
  const [userRole, setUserRole] = useState("");
  const [id, setId] = useState();
  const [goalList, setgoalList] = useState([]);
  const location = useLocation();
  const [kpiPercentages, setKPIPercentages] = useState([]);
  const [comments, setComments] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [lineChartLabels, setLineChartLabels] = useState([]);
  const [barGraphData, setBarGraphData] = useState({
    notStarted: [],
    inProgress: [],
    completed: [],
  });
  const [barGraphLabels, setBarGraphLabels] = useState([]);

  // fetchData function called when location state changes or component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { role, _ } = await fetchUserData(location.state.id);
        setUserRole(role);
        const employeeId = await getEmployeeId(location.state.id);
        setId(employeeId);
        const fetchedGoalList = await fetchGoalList(employeeId);
        setgoalList(fetchedGoalList);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [location.state.id]);

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

  const fetchComments = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_URL2}/fetchComments`, {
        id: id,
        role: userRole,
        email: location.state.id,
      });
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching KPI ratings:", error);
    }
  };

  useEffect(() => {
    if (id && userRole) {
      fetchKpiRatings();
      fetchComments();
    }
  }, [id, userRole]);

  const predefinedColors = [
    "rgb(18, 155, 131)",
    "rgb(40,108,238)",
    "rgb(240,145,81)",
    "rgb(251,180,28)",
  ];

  const renderKPIs = (startIndex, endIndex) => {
    return kpiPercentages.slice(startIndex, endIndex).map((kpi, index) => {
      const color = predefinedColors[index % predefinedColors.length];

      return (
        <div className="kpi" key={index}>
          <div className="kpi-box">
            <div className="kpi-metrics">
              <span className="kpi-name">{kpi.name}</span>
              <span
                className="kpi-percentage"
                style={{ color: color, fontSize: "1rem" }}
              >
                {kpi.rating}%
              </span>
            </div>
            <div className="donut-chart">
              <DoughnutChart percentage={kpi.rating} color={color} />
            </div>
          </div>
        </div>
      );
    });
  };

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
          <div className="kpi-rating" style={{ height: '1%' }}>
            {kpi.rating}%
          </div>
          {kpiComment = kpiComments.find((item) => item.kpi === kpi.name) && (
          <div className="kpi-comment">{kpiComment}</div>
          )}
        </div>
      ));
    }
  };

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
    const calculateBarGraphData = () => {
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const completedGoalsCountByMonth = {};
      const createdGoalsCountByMonth = {};

      const months = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        const month = date.toLocaleString("default", { month: "short" });
        completedGoalsCountByMonth[month] = {
          notStarted: 0,
          inProgress: 0,
          completed: 0,
        };
        createdGoalsCountByMonth[month] = 0;
        months.push(month);
      }
      months.reverse(); // reversed to start with the oldest month

      goalList.forEach((goal) => {
        const creationDate = new Date(goal.creationDate);
        const completionDate = new Date(goal.completionDate);

        if (creationDate >= sixMonthsAgo && creationDate <= currentDate) {
          const month = creationDate.toLocaleString("default", {
            month: "short",
          });

          // increment the count for the corresponding status
          if (goal.status === "Done") {
            completedGoalsCountByMonth[month].completed += 1;
          } else if (goal.status === "In Progress") {
            completedGoalsCountByMonth[month].inProgress += 1;
          } else if (goal.status === "To Do") {
            completedGoalsCountByMonth[month].notStarted += 1;
          }
          // increment the count for the month the goal was created in
          createdGoalsCountByMonth[month] += 1;
        }
      });

      const data = {
        notStarted: [],
        inProgress: [],
        completed: [],
      };

      months.forEach((month) => {
        data.notStarted.push(completedGoalsCountByMonth[month].notStarted);
        data.inProgress.push(completedGoalsCountByMonth[month].inProgress);
        data.completed.push(completedGoalsCountByMonth[month].completed);
      });

      setBarGraphData(data);
      setBarGraphLabels(months);
    };

    calculateBarGraphData();
  }, [goalList]);

  // Page is divided into 2 parts; so contentt-1 div displays KPIs, Task Statistics, Areas to Improve & Comments. Content-2 div displays a quote, Task Status & Total Tasks Completed
  return (
    <SidebarMenu role={userRole}>
      <div className="homepage">
        <div className="contentt-1">
          <div className="page-heading">Analytics</div>
          <div className="kpis-1st-container">{renderKPIs(0, 4)}</div>
          <div className="kpis-2nd-container">{renderKPIs(4, 8)}</div>
          {/* kpis over */}
          <div className="task-statistics">
            <div className="task-statistics-heading">Task Statistics</div>
            <div className="task-statistics-graphs">
              <div className="task-statistics-line-chart">
                <LineChart data={lineChartData} labels={lineChartLabels} style={{ width: "100%", height: "100%" }}/>
              </div>
              <div className="task-statistics-bar-graph">
                {/* Not Started, In Progress & Completed tasks data for each month */}
                <BarGraph data={barGraphData} labels={barGraphLabels} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
          <div className="feedback-summary">
            <div className="areas-to-improve-container">
              <span className="areas-to-improve-heading">Areas to Improve</span>
              {renderLowestKPIs()}
            </div>
            <div className="comments-container">
              <span className="comments-heading">Comments</span>
              {comments.map((comment, index) => (
                <div className="comment" key={index}>
                  {comment.anonymous && (comment.approved) ? (
                    <div>
                      <div>
                        <span className="who-commented"> Anonymous</span>
                      </div>
                      <div className="comment-description">
                        {comment.comment}
                      </div>
                    </div>
                  ) : (
                    // If the comment is not anonymous, display Project manager's name and comment
                    <div>
                      <div>
                        <span className="who-commented">Project Manager</span>
                      </div>
                      <div className="comment-description">
                        {comment.comment}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="content-2">
          <NotifBar />
          <img src={pic} alt="pic" style={{ width: "99%" }}></img>
          <div className="task-status">
            <div className="task-status-heading">Task Status</div>
            <div className="task-status-donut-chart">
              {/* Data for the task status doughnut chart: we filtered the employee's goal list based on status and calculated the lengths of all 3 arrays */}
              <TaskstatusChart
                data={[
                  goalList.filter((item) => item.status === "To Do").length,
                  goalList.filter((item) => item.status === "In Progress")
                    .length,
                  goalList.filter((item) => item.status === "Done").length,
                ]}
                legendLabels={["Not Started", "In Progress", "Completed"]}
              />
            </div>
          </div>
          <div className="total-tasks-completed">
            <div className="total-tasks-completed-text">
              Total tasks completed:{" "}
              {goalList.filter((item) => item.status === "Done").length}
            </div>
          </div>
        </div>
      </div>
    </SidebarMenu>
  );
}

export default EmployeeAnalytics;
