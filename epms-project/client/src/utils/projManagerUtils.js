// this file contains the functions to fetch the projManagerId and the goalList, role and name of a project manager
import axios from "axios";

export const fetchUserData = async (email) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_URL2}/fetchProjManagerInfo`,
      {
        email: email,
      }
    );

    if (response.status === 200 && response.data.success) {
      const { role, projManagerName } = response.data;
      return { role, projManagerName };
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
};

export const getProjManagerId = async (email) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_URL2}/fetchProjManagerId`,
      { email: email }
    );

    if (response.status === 200) {
      const data = response.data;
      if (data.success) {
        return data.projManagerId;
      } else {
        console.error("Failed to fetch Proj Manager Id:", data.message);
      }
    } else {
      console.error("Failed to fetch Proj Manager Id:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch Proj Manager Id:", error.message);
  }
};

export const fetchGoalList = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_URL2}/goalListForProjectManager`,
      {
        id,
      }
    );
    if (response.status === 200 && response.data.success) {
      return Array.from(response.data.goals.values());
    } else {
      console.error("Failed to fetch goal list");
    }
  } catch (error) {
    console.error("Error fetching goal list:", error.message);
  }
};
