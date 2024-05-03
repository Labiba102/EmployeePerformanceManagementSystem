import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu";
import "./customizeFeedbackForm.css";
import pic from "./feedbackformimg.jpeg";
import AddKPIModal from "./addKPIModal";

const CustomizeFeedbackForm = () => {
  const [department, setDepartment] = useState("");
  const [deptExists, setDeptExists] = useState(false);
  const [base_kpis, set_base_kpis] = useState([]);
  const [added_kpis, set_added_kpis] = useState([]);
  const [showAddKPI, setShowAddKPI] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(null);
  const [weightageTotalError, setWeightageTotalError] = useState("");
  const [weightageNullError, setWeightageNullError] = useState("");
  const [commentsEnabledError, setCommentsEnabledError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.id || "guest";

  const { id, role } = location.state;

  // This function gets the department name of the HR manager to be displayed and used for form customization
  const getDepartment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchDepartmentNameHR`,
        { email: location.state.id }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setDepartment(data.department);
          setDeptExists(true);
          // console.log(department)
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

  // This function gets the details of the form if it already exists so that the previous kpis and
  // weightages of these KPIs can be displayed
  const getFormIfExists = async () => {
    // console.log(department)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/fetchFeedbackForm`,
        { department: department }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setKPIWeightages(data.base_kpis, data.added_kpis);
          return null;
        } else {
          console.log("Failed to fetch Feedback Form:", data.message);
          return null;
        }
      } else {
        console.log("Failed to fetch Feedback Form:", response.statusText);
        return null;
      }
    } catch (error) {
      console.log("Failed to fetch Feedback Form:", error.message);
      return null;
    }
  };

  //This function is used to set the kpi arrays received from the backend
  const setKPIWeightages = (base_kpis, added_kpis) => {
    set_base_kpis(base_kpis);
    set_added_kpis(added_kpis);
  };

  //Check Total of all the weightages (it should add up to exactly 100)
  const checkTotal = () => {
    const total_base_kpis = base_kpis.reduce(
      (sum, kpi) => sum + parseInt(kpi.weightage),
      0
    );
    const total_added_kpis = added_kpis.reduce(
      (sum, kpi) => sum + parseInt(kpi.weightage),
      0
    );

    console.log(total_base_kpis);
    console.log(total_added_kpis);

    const total = total_base_kpis + total_added_kpis;

    if (total !== 100) {
      setWeightageTotalError("Weightages should add up to 100!");
      return false;
    } else {
      setWeightageTotalError("");
      return true;
    }
  };

  //Function is to see that none of the weightages are null or 0
  const checkWeightages = () => {
    let weightagesExistBaseKpis = base_kpis.every((item) => item.weightage > 0);
    let weightagesExistAddedKpis = added_kpis.every(
      (item) => item.weightage > 0
    );

    if (!weightagesExistBaseKpis || !weightagesExistAddedKpis) {
      setWeightageNullError("Weightages for KPIs should not be zero");
      return false;
    } else {
      setWeightageNullError("");
      return true;
    }
  };

  const handleSubmit = async () => {
    if (!checkTotal()) {
      return;
    }

    if (!checkWeightages()) {
      return;
    }

    if (commentsEnabled === null) {
      setCommentsEnabledError("This field is required");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/saveFeedbackForm`,
        {
          department: department,
          base_kpis: base_kpis,
          added_kpis: added_kpis,
          comments_enabled: commentsEnabled,
        }
      );

      if (response.status === 200) {
        navigate("/HRManagerHome", { state: { id: email } });
      } else {
        console.error("Failed to add Form to DB:", response.statusText);
        return null;
      }
    } catch (e) {
      console.error("Error Saving Form to DB:", e.message);
    }
  };

  const handleAddMore = () => {
    setShowAddKPI(true);
  };

  const closeAddKPIModal = () => {
    setShowAddKPI(false);
  };

  const handleAddMoreData = (name, weightage) => {
    const obj = { name: name, weightage: weightage };

    const temp_array = [...added_kpis, obj];
    set_added_kpis(temp_array);
  };

  const setWeightageAddedKPI = (weightage, name) => {
    const updatedKPIs = added_kpis.map((item) =>
      item.name === name ? { ...item, weightage: weightage } : item
    );
    set_added_kpis(updatedKPIs);
  };

  getDepartment();
  useEffect(() => {
    if (deptExists) getFormIfExists();
  }, [deptExists]);

  // handles if the weightage of a base kpi is changed
  const handleBaseKpiWeightageChange = (value, name) => {
    const updatedBaseKPIs = base_kpis.map((kpi) =>
      kpi.name === name ? { ...kpi, weightage: parseInt(value) } : kpi
    );
    console.log(updatedBaseKPIs);
    set_base_kpis(updatedBaseKPIs);
  };

  return (
    <SidebarMenu role={role}>
      <div className="feedback-form">
        <div className="feedback-form-image">
          <img src={pic} alt="pic" className="feedback-form-img" />
        </div>
        <div className="feedback-form-heading">
          <p>Customize Feedback Form</p>
          <div className="feedback-form-heading-underline"></div>
        </div>
        <div className="feedback-form-department-name">
          <span>Department:</span>
          <p>{department}</p>
        </div>
        <div className="feedback-form-weightage-setting">
          <div className="feedback-form-weightage-setting-heading">
            Set the weightages for all KPIs
          </div>
          <div className="feedback-form-kpi-container">
            {base_kpis.map((kpi, index) => (
              <div className="feedback-form-kpi" key={index}>
                <label className="feedback-form-kpi-name">{kpi.name}</label>
                <input
                  className="feedback-form-kpi-input"
                  name={kpi.name}
                  type="number"
                  autoComplete="off"
                  value={kpi.weightage}
                  onChange={(e) => {
                    setWeightageAddedKPI(parseInt(e.target.value), kpi.name);
                    handleBaseKpiWeightageChange(e.target.value, kpi.name);
                  }}
                />
              </div>
            ))}
            {added_kpis.map((kpi, index) => (
              <div className="feedback-form-kpi" key={base_kpis.length + index}>
                <label className="feedback-form-kpi-name">{kpi.name}</label>
                <input
                  name={kpi.name}
                  type="number"
                  autoComplete="off"
                  value={kpi.weightage}
                  className={`feedback-form-kpi-input ${
                    weightageNullError ? "error" : ""
                  }
                  ${weightageTotalError ? "error" : ""}`}
                  onChange={(e) =>
                    setWeightageAddedKPI(parseInt(e.target.value), kpi.name)
                  }
                />
              </div>
            ))}
          </div>
          <div className="feedback-form-add-more-button">
            <button className="add-more-button" onClick={handleAddMore}>
              <p>Add More</p>
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="add-more-kpi-icon"
              />
            </button>
            {weightageNullError && (
              <p className="error-message-feedback-form">
                {weightageNullError}
              </p>
            )}
            {weightageTotalError && (
              <p className="error-message-feedback-form">
                {weightageTotalError}
              </p>
            )}
          </div>
        </div>
        <div className="feedback-form-comments-enable">
          <p>Enable comments?</p>
          <div className="comments-checkbox-container">
            <div className="comments-checkbox-container-option">
              <input
                type="checkbox"
                id="enable-comments-yes"
                name="enable-comments"
                checked={commentsEnabled === true}
                onChange={() => setCommentsEnabled(true)}
              />
              <label htmlFor="enable-comments-yes">
                Yes
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="comments-checkbox-container-option">
              <input
                type="checkbox"
                id="enable-comments-no"
                name="enable-comments"
                checked={commentsEnabled === false}
                onChange={() => setCommentsEnabled(false)}
              />
              <label htmlFor="enable-comments-no">
                No
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
          {commentsEnabledError && (
            <p className="error-msg-comment-enabled">{commentsEnabledError}</p>
          )}
        </div>
        <AddKPIModal
          showModal={showAddKPI}
          closeModal={closeAddKPIModal}
          handleData={handleAddMoreData}
          added_kpi={added_kpis}
        />
        <div className="feedback-form-submit-button">
          <button className="feedback-submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </SidebarMenu>
  );
};

export default CustomizeFeedbackForm;
