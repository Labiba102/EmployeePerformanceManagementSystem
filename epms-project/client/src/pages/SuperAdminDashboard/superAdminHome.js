import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styling/superAdminHome.css";
import MakeAccountModal from "./MakeAccountModal.js";
import MainDisplay from "../../components/Dashboard/MainDisplay.js";
import WelcomeBox from "../../components/Dashboard/WelcomeBox.js";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu.js";
import { getCurrentTimeGreeting } from "../../utils/utils.js";

function AdminHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMakeAccount, setShowMakeAccount] = useState(false);

  const email = location.state?.id || "guest";
  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/superAdminHome", { state: { id: email } });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Define department options
  const departmentOptions = [
    "Engineering",
    "Application Development",
    "Design",
    "Finance",
    "Sales",
    "Security",
    "Communication",
    "Marketing",
  ];

  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    } else {
      // Fetch staff list from the server upon component mount
      fetchStaffList();
    }
  }, [location.state, navigate]);

  // fetches enitre companys staff list from the backend
  const fetchStaffList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL2}/staffList`);
      if (response.status === 200 && response.data.success) {
        setStaffList(response.data.staffList);
      } else {
        console.error("Failed to fetch staff list");
      }
    } catch (error) {
      console.error("Error fetching staff list:", error.message);
    }
  };


  useEffect(() => {
    // Filter staff list based on department filter and search query
    let filteredList = staffList.filter((staff) => {
      return (
        staff.department.includes(departmentFilter) &&
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredStaffList(filteredList);
  }, [staffList, departmentFilter, searchQuery]);

  const handleMakeAccountButton = () => {
    setShowMakeAccount(true);
    document.body.classList.add("show-modal");
  };

  const closeMakeAccountModal = () => {
    document.body.classList.remove("show-modal");
    setShowMakeAccount(false);
  };

  const firstName = "Admin";

  return (
    <SidebarMenu role={"Super Admin"}>
      <div className="homepage">
        <div className="content-admin">
          <MainDisplay
            firstName={firstName}
            getCurrentTimeGreeting={getCurrentTimeGreeting}
          />

          <WelcomeBox></WelcomeBox>

          <div className="button-wrapper-super-admin">
            <button onClick={handleMakeAccountButton}>Make Account</button>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departmentOptions.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="box">
            <div className="header-admin-page">
              <h className="title-admin-page">User List</h>
              <h className="seeall">
                {/* <a href="https://www.instagram.com" className="seeall-link">
                See All <span>﹥</span>
              </a> */}
              </h>
            </div>
            <div className="headings">
              <div className="heading-item">Name</div>
              <div className="heading-item">Email Id</div>
              <div className="heading-item">Department</div>
              <div className="heading-item">Role</div>
            </div>

            {filteredStaffList.map((staff, index) => (
              <div
                className={
                  index === filteredStaffList.length - 1
                    ? "content-last"
                    : "content-1"
                }
                key={index}
              >
                <p className="c">{staff.name}</p>
                <p className="c">{staff.email}</p>
                <p className="c">{staff.department}</p>
                <p className="c">{staff.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="content2">
          <div className="notif-profile">
            <h1 className="notif-bar"></h1>
            </div>
            <QuoteBox></QuoteBox>
            <div className="important-timelines">
            <div className="timeline-heading">Important Timelines</div>
            </div>
            <div className="review-status">
            <div className="review-status-heading">Review Status</div>
            </div>
        </div> */}

        <MakeAccountModal
          showModal={showMakeAccount}
          closeModal={closeMakeAccountModal}
        />
      </div>
    </SidebarMenu>
  );
}

export default AdminHome;
