import React from "react";
import "./Dashboard.css";

// component for the header and greeting displayed for each user (it is passed the first name and greeting time)
const MainDisplay = ({ firstName, getCurrentTimeGreeting }) => {
  return (
    <div className="main-display">
      <div className="dashboard-main-heading">
        <h1 className="dashboard-heading">Hello, {firstName} 👋</h1>
      </div>
      <p className="morning-header">{getCurrentTimeGreeting()}</p>
    </div>
  );
};

export default MainDisplay;
