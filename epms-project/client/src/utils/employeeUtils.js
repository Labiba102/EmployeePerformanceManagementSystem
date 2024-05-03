// this file contains the functions to fetch the employeeId and the goalList, role and name of an employee
import axios from "axios";

export const fetchUserData = async (email) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_URL2}/fetchEmployeeInfo`,
      {
        email: email,
      }
    );

    if (response.status === 200 && response.data.success) {
      const { role, employeeName } = response.data;
      return { role, employeeName };
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
};

export const getEmployeeId = async (email) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_URL2}/fetchEmployeeId`, {
      email: email,
    });

    if (response.status === 200) {
      const data = response.data;
      if (data.success) {
        return data.employeeId;
      } else {
        console.error("Failed to fetch EmployeeId:", data.message);
      }
    } else {
      console.error("Failed to fetch EmployeeId:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch EmployeeId:", error.message);
  }
};

export const fetchGoalList = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_URL2}/goalListEmployee`,
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
