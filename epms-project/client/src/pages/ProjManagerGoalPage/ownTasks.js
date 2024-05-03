//Fetch all goals and display
//Add button to make new goal that leads to goalSetting.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import OwnGoals from "../../components/OwnGoals/OwnGoals.js";
import {
  fetchUserData,
  getProjManagerId,
  fetchGoalList,
} from "../../utils/projManagerUtils.js";

function ProjectManagerOwnGoals() {
  const location = useLocation();
  const [goalList, setgoalList] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [id, setId] = useState();

  // fetches data, id and the goal list (correspinding to the id) stored at the backend to be displayed on the kanban goal page of the user.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { role, _ } = await fetchUserData(location.state.id);
        setUserRole(role);
        const projManagerId = await getProjManagerId(location.state.id);
        setId(projManagerId);
        const fetchedGoalList = await fetchGoalList(projManagerId);
        setgoalList(fetchedGoalList);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 250);

    return () => clearInterval(intervalId);
  }, [location.state.id]);
  return <OwnGoals id={id} role="Project Manager" goalList={goalList}></OwnGoals>;
}

export default ProjectManagerOwnGoals;
