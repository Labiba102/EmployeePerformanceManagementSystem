// Sidebar Menu component which is to be displayed on each page
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import logo from "./logo.png";
import "./SidebarMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faListCheck,
  faChartLine,
  faComment,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// it takes role as a prop. based on the role, the user is navigated to the specific page corresponding to his role
const SidebarMenu = ({ role, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.id || "guest";

  // the following few functions set up routes for the user (based on role) for all pages accessible through the sidebar
  const getDashboardRoute = () => {
    if (role === "Employee") {
      return "/employeeHome";
    } else if (role === "Project Manager") {
      return "/projManagerHome";
    } else if (role === "HR Manager") {
      return "/HrManagerHome";
    } else if (role === "Super Admin") {
      return "/superAdminHome";
    }
  };

  const getGoalsRoute = () => {
    if (role === "Employee") {
      return "/employeeTasks";
    } else if (role === "Project Manager") {
      return "/projectManagerTasks";
    } else if (role === "HR Manager") {
      return "/HrTasks";
    }
  };

  const getAnalyticsRoute = () => {
    if (role === "Employee") {
      return "/employeeAnalytics";
    } else if (role === "Project Manager") {
      return "/projManagerAnalytics";
    } else if (role === "HR Manager") {
      return "/HRAnalytics";
    }
  
  };

  const getFeedbackRoute = () => {
    if (role === "Employee") {
      return "/employeeFeedback";
    } else if (role === "Project Manager") {
      return "/projManagerEvaluationForm";
    } else if (role === "HR Manager") {
      return "/hrManagerEvaluationForm";
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    localStorage.clear(token);
    navigate("/", { replace: true });
  };

  // returns menu based on role (made since Super Admin is only to be displayed the Dashboard option (cz his role is only to make accounts), while others are to be displayed all other options)
  const getMenuItems = () => {
    if (role === "Super Admin") {
      return [
        {
          label: "Dashboard",
          icon: faBars,
          onClick: () => navigate("/superAdminHome", { state: { id: email } }),
        },
      ];
    } else if (role === "HR Manager") {
      return [
        {
          label: "Dashboard",
          icon: faBars,
          onClick: () => navigate(getDashboardRoute(), { state: { id: email } }),
        },
        {
          label: "Feedback",
          icon: faComment,
          onClick: () => navigate(getFeedbackRoute(), { state: { id: email } }),
        },
      ];
    } else {
      // For Project Manager and Employee roles
      return [
        {
          label: "Dashboard",
          icon: faBars,
          onClick: () => navigate(getDashboardRoute(), { state: { id: email } }),
        },
        {
          label: "Goals",
          icon: faListCheck,
          onClick: () => navigate(getGoalsRoute(), { state: { id: email } }),
        },
        {
          label: "Analytics",
          icon: faChartLine,
          onClick: () => navigate(getAnalyticsRoute(), { state: { id: email } }),
        },
        {
          label: "Feedback",
          icon: faComment,
          onClick: () => navigate(getFeedbackRoute(), { state: { id: email } }),
        },
      ];
    }
  };
  
  return (
    <div className="homepage">
      <div className="sidebar">
        <div className="side-bar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logoText">Devsinc</span>
        </div>
        <ul>
          {getMenuItems().map((menuItem, index) => (
            <li key={index} onClick={menuItem.onClick}>
              <FontAwesomeIcon icon={menuItem.icon} style={{ marginRight: "10%" }} />
              <span>{menuItem.label}</span>
            </li>
          ))}
        </ul>
        <div className="log-out" onClick={handleLogout}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            style={{ color: "white", marginRight: "10%" }}
          />
          <span>Log Out</span>
        </div>
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
};


export default SidebarMenu;
