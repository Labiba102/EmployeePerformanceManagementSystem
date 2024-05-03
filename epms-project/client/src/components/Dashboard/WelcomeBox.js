import React from "react";
import pic from "../../images/epms_welcome.png";
import "./Dashboard.css";

// component for the welcome box displayed on all dashboards
const WelcomeBox = () => {
  return (
    <div className="green-box">
      <p className="welcome-text">
        Welcome to Employee Performance <br></br> Management System
      </p>
      <img src={pic} alt="pic" className="welcome-pic"></img>
    </div>
  );
};

export default WelcomeBox;
