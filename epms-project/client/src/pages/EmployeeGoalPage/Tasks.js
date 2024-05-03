import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import OwnGoals from "../../components/OwnGoals/OwnGoals.js";
import {
  fetchUserData,
  getEmployeeId,
  fetchGoalList,
} from "../../utils/employeeUtils.js";

function EmployeeTasksPage() {
  const location = useLocation();
  const [goalList, setgoalList] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [id, setId] = useState("");

  // fetches data, id and the goal list (correspinding to the id) stored at the backend to be displayed on the kanban goal page of the user
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

    const intervalId = setInterval(fetchData, 250);

    return () => clearInterval(intervalId);
  }, [location.state.id]);

  return <OwnGoals id={id} role="Employee" goalList={goalList}></OwnGoals>;
}

export default EmployeeTasksPage;
