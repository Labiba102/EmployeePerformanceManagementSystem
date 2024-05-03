import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import EvaluationForm from "../../components/EvaluationForm/EvaluationForm.js";

const ProjectManagerEvaluationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");

  // the evaluation form that the project manager will fill for the team of employees under him
  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/");
    } else {
      getDepartment();
    }
  }, [location.state, navigate]);

  // gets the department of the project manager (since the assigned team will be of the same department)
  const getDepartment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentNameProjManager`,
        { email: location.state.id }
      );

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

  // evaluation form is a component since it is common to both hr manager and project manager, difference being the team under them. hence the prop 'role' is passed so that evaluation form fetches and saves info accordingly
  return (
    <SidebarMenu role={"Project Manager"}>
      <EvaluationForm
        role={"Project Manager"}
        department={department}
      ></EvaluationForm>
    </SidebarMenu>
  );
};

export default ProjectManagerEvaluationForm;
