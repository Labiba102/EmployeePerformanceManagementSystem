import React from "react";
import "./teamProgress.css";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import pic from "./bg.jpg";
import DoughnutChart from "../Dashboard/Doughnutchart";

const ViewTeamProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.id || "guest";
  const [id, setId] = useState(""); // to store id for proj manager to get the team of employees under him
  const [base_kpis, set_base_kpis] = useState([]); // list of kpis that are common for all departments
  const [added_kpis, set_added_kpis] = useState([]);
  const [name, setName] = useState("");
  const [names, setNames] = useState([]); // list of team names
  const [emailIds, setEmailIds] = useState([]); //list of email ids of team members
  const [formExists, setFormExists] = useState(false); //boolean to check if form the form is fetched
  const [ratings, setRatings] = useState({}); //to store ratings for each kpi
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [month, setMonth] = useState("");
  const [kpiscore, setKpiScore] = useState(null);

  const { _, role } = location.state;

  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    } else {
      getDepartment();
    }
  }, [location.state, navigate]);

  // This function gets the department name of the HR manager to be displayed and used for form customization
  const getDepartment = async () => {
    try {
      let apiUrl = "";
      if (role == "Project Manager") {
        apiUrl = `${process.env.REACT_APP_URL2}/fetchDepartmentNameProjManager`;
      } else if (role === "HR Manager") {
        apiUrl = `${process.env.REACT_APP_URL2}/fetchDepartmentNameHR`;
      }
      const response = await axios.post(apiUrl, { email: location.state.id });

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setDepartment(data.department);
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

  useEffect(() => {
    // if the form against that department exists, the base kpis and added kpis set by the hr manager for that department are set here (to calculate the kpi score)
    const getFormIfExists = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL2}/fetchFeedbackForm`,
          { department: department }
        );

        if (response.status === 200) {
          const data = response.data;
          if (data.success) {
            // updating state with fetched KPIs and comments availability
            set_base_kpis(data.base_kpis);
            set_added_kpis(data.added_kpis);
            setFormExists(true);
          } else {
            console.log("Failed to fetch Feedback Form:", data.message);
          }
        } else {
          console.log("Failed to fetch Feedback Form:", response.statusText);
        }
      } catch (error) {
        console.log("Failed to fetch Feedback Form:", error.message);
      }
    };

    if (department) {
      getFormIfExists();
    }
  }, [department]);

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const months = [];

  for (let i = 0; i <= currentMonthIndex; i++) {
    const date = new Date(currentDate.getFullYear(), i, 1);
    const monthName = date.toLocaleString("default", { month: "long" });
    months.push(monthName);
  }

  useEffect(() => {
    // Fetch Project Manager's ID if the role is "Project Manager"
    if (role === "Project Manager") {
      try {
        const fetchProjManagerId = async () => {
          const response = await axios.post(
            `${process.env.REACT_APP_URL2}/fetchProjManagerId`,
            { email: location.state.id }
          );

          if (response.status === 200) {
            const data = response.data;
            if (data.success) {
              setId(data.projManagerId);
            } else {
              console.error("Failed to fetch Proj Manager Id:", data.message);
            }
          } else {
            console.error(
              "Failed to fetch Proj Manager Id:",
              response.statusText
            );
          }
        };

        fetchProjManagerId();
      } catch (error) {
        console.error("Failed to fetch Proj Manager Id:", error.message);
      }
    } else if (role === "HR Manager") {
      try {
        const fetchHrManagerId = async () => {
          const response = await axios.post(
            `${process.env.REACT_APP_URL2}/fetchHrManagerId`,
            { email: location.state.id }
          );

          if (response.status === 200) {
            const data = response.data;
            if (data.success) {
              setId(data.hrManagerId);
            } else {
              console.error("Failed to fetch HR Manager Id:", data.message);
            }
          } else {
            console.error(
              "Failed to fetch HR Manager Id:",
              response.statusText
            );
          }
        };

        fetchHrManagerId();
      } catch (error) {
        console.error("Failed to fetch HR Manager Id:", error.message);
      }
    }
  }, [role, location.state.id]);

  useEffect(() => {
    if (department && role && id) {
      teamInfo();
    }
  }, [department, role, id]);

  // Fetch team info from backend (for whom feedback can be filled)
  const teamInfo = async () => {
    try {
      let postData = { department, role, type: "EvalForm", id: null };

      if (role === "Project Manager") {
        postData.id = id;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentInfo`,
        postData
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        if (data.success) {
          const filteredNames = [];
          const filteredEmails = [];
          data.teamProjectManager.map((person) => {
            filteredNames.push(person.name);
            filteredEmails.push(person.email);
          });
          setNames(filteredNames);
          setEmailIds(filteredEmails);
        } else {
          console.log("Failed to fetch team Names:", data.message);
        }
      } else {
        console.log("Failed to fetch team Names:", response.statusText);
      }
    } catch (error) {
      console.log("Failed to fetch team Names:", error.message);
    }
  };

  useEffect(() => {
    if (name && email && month) {
      fetchPerformanceHistory();
    }
  }, [name, email, month]);

  // filled forms that are saved with the month and email ids are fetched depending on which months history the user wants to see. depending on the email and month, the ratings given to that employee for that month are fetched.
  const fetchPerformanceHistory = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchPerfomanceHistory`,
        {
          role: role,
          email: employeeEmail,
          month: month,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setRatings(data.data);
        } else {
          console.log("Failed to fetch employee performance data.");
        }
      } else {
        console.log("Failed to fetch employee performance data.");
      }
    } catch (error) {
      console.log("Failed to fetch employee performance data.");
    }
  };

  // calcuates the score of the employee for that month based on the ratings and the weightages of the kpis fetched from the backend
  const calculateOverallScore = () => {
    let totalScore = 0;
    let totalWeightage = 0;
    base_kpis.forEach((kpi) => {
      totalScore += (ratings[kpi.name] / 5) * kpi.weightage;
      totalWeightage += kpi.weightage;
    });

    added_kpis.forEach((kpi) => {
      totalScore += (ratings[kpi.name] / 5) * kpi.weightage;
      totalWeightage += kpi.weightage;
    });
    const overallScore = (totalScore * 10) / totalWeightage;
    return overallScore;
  };

  useEffect(() => {
    if (ratings && Object.keys(ratings).length > 0) {
      const overallScore = calculateOverallScore();
      setKpiScore(overallScore);
    }
  }, [ratings]);

  const predefinedColors = [
    "rgb(18, 155, 131)",
    "rgb(40,108,238)",
    "rgb(240,145,81)",
    "rgb(251,180,28)",
  ];

  // shows kpi percentages along with doughnut charts to see each kpi's progress
  const renderKPIs = (startIndex, endIndex) => {
    const kpiPercentages = Object.entries(ratings);
    console.log(kpiPercentages);
    return Object.entries(ratings)
      .slice(startIndex, endIndex)
      .map(([kpiName, kpiRating], index) => {
        const color = predefinedColors[index % predefinedColors.length];

        return (
          <div className="kpi-history" key={index}>
            <div className="kpi-box">
              <div className="kpi-metrics">
                <span className="kpi-name">{kpiName}</span>
                <span
                  className="kpi-percentage"
                  style={{ color: color, fontSize: "1rem" }}
                >
                  {(kpiRating / 5) * 100}%
                </span>
              </div>
              <div className="donut-chart">
                <DoughnutChart
                  percentage={(kpiRating / 5) * 100}
                  color={color}
                />
              </div>
            </div>
          </div>
        );
      });
  };

  // calculates number of rows needed to display the kpis (4 per row)
  const renderKPIContainers = () => {
    const kpiPercentages = Object.entries(ratings);
    const numContainers = Math.ceil(kpiPercentages.length / 4);

    const containers = [];
    for (let i = 0; i < numContainers; i++) {
      const startIndex = i * 4;
      const endIndex = Math.min(startIndex + 4, kpiPercentages.length);
      containers.push(
        <div
          className={`kpis-container kpis-container-${i}`}
          key={i}
          style={{
            marginTop: "1%",
            marginBottom: "2%",
            height: "10%",
            display: "flex",
          }}
        >
          {renderKPIs(startIndex, endIndex)}
        </div>
      );
    }

    return containers;
  };

  return (
    <SidebarMenu role={role}>
      <div className="team-performance-main">
        <div className="performance-heading-div">
          <p className="performance-heading">Employee Performance History</p>
        </div>
        <div className="performance-employee-info">
          <div className="performance-employee-info-heading">
            Select Employee
          </div>
          <div className="performance-employee-info-dropdowns">
            <select
              className="employee-info-dropdown"
              onChange={(e) => setEmployeeEmail(e.target.value)}
            >
              <option value="" disabled selected hidden>
                Email ID
              </option>
              {emailIds.map((email, index) => (
                <option key={index} value={email}>
                  {email}
                </option>
              ))}
            </select>
            <select
              className="employee-info-dropdown"
              onChange={(e) => setName(e.target.value)}
            >
              <option value="" disabled selected hidden>
                Name
              </option>
              {names.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              className="employee-info-dropdown"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="" disabled selected hidden>
                Months
              </option>
              {months.map((period, index) => (
                <option key={index} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="person-monthly-evaluation-heading">
          {name} - {month} Statistics
        </div>
        <div className="team-member-scores-container">
          <div className="team-member-scores-bg">
            <img src={pic} alt="Background" />
          </div>
          {kpiscore !== null && (
            <div className="score-overlay">
              <div className="total-score-text">Total Score:</div>
              <div className="total-score-math">
                {kpiscore.toFixed(2)}/10
              </div>{" "}
            </div>
          )}
          {kpiscore !== null && (
          <div className="completion-overlay">
            <div className="task-completion-text">Task Completion Rate:</div>
            <div className="task-completion-math">
              87.5%
            </div>{" "}
          </div>
          )}
          {kpiscore !== null && (
          <div className="progress-overlay">
            <div className="task-progress-text">Task Progress:</div>
            <div className="task-progress-math">
              66.7%
            </div>{" "}
          </div>
          )}
        </div>

        <div className="team-member-performance-kpis">
          <div className="team-member-performance-kpis-heading">
            Key Performance indicators
          </div>
          <div className="kpis-wrapper">{renderKPIContainers()}</div>
        </div>
      </div>
    </SidebarMenu>
  );
};

export default ViewTeamProgress;
