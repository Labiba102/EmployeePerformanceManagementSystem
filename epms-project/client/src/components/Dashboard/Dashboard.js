import React from "react";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import "./Dashboard.css";

// dashboard component which will be rendered when the user logs in
const Dashboard = ({ role, children }) => {
  return (
    <SidebarMenu role={role}>
      {/* this renders children components inside a div with class 'content'*/}
      <div className="content">{children}</div>
    </SidebarMenu>
  );
};

export default Dashboard;
