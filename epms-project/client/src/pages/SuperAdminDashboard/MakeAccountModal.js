import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styling/makeAccount.css";
import avatar from "./Styling/avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { uploadImageToFirebase } from "../../utils/firebase-config";

// a popup where an account for an employee is made on this system.
const MakeAccountModal = ({ showModal, closeModal }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setdepartment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [serverError, setServerError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // handles when the modal is closed
  const handleClose = () => {
    closeModal();
  };

  // validates whether all fields are filled or not
  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!firstName) {
      setFirstNameError("First name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Last name is required");
      isValid = false;
    } else {
      setLastNameError("");
    }

    if (!role) {
      setRoleError("Employee role is required");
      isValid = false;
    } else {
      setRoleError("");
    }

    if (!department) {
      setDepartmentError("Department name is required");
      isValid = false;
    } else {
      setDepartmentError("");
    }

    return isValid;
  };

  // validates the password (should be strong, have one special character, be at least 8 characters long, have at least one digit and have at least one capital letter)
  const validatePassword = (password) => {
    if (password.length < 8) {
      console.error(
        "Error! Weak Password. Password should be at least 8 characters long."
      );
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      console.error(
        "Error! Weak Password. Password should have at least 1 special character."
      );
      return false;
    }

    if (!/\d/.test(password)) {
      console.error(
        "Error! Weak Password. Password should have at least 1 digit."
      );
      return false;
    }

    if (!/[a-z]/.test(password)) {
      console.error(
        "Error! Weak Password. Password should have at least 1 lowercase character."
      );
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      console.error(
        "Error! Weak Password. Password should have at least 1 uppercase character."
      );
      return false;
    }

    return true;
  };

  // validates email - checks if email ends with @devsinc.org.pk (domain name for our system for all emails)
  const isValidEmail = (email) => {
    const domain = email.substring(email.lastIndexOf("@") + 1);
    if (!email.includes("@")) {
      console.error(
        "Error! Invalid Email. Email should include the @ character"
      );
      return false;
    }
    if (domain !== "devsinc.org.pk") {
      console.error("Error! Invalid Domain.");
      return false;
    }

    const usernamePart = email.split("@")[1].split(".")[0];
    if (!/^[a-zA-Z]+$/.test(usernamePart)) {
      console.error(
        "Error! Invalid Email. Email should only contain letters between @ and .com"
      );
      return false;
    }
    return true;
  };

  // handles the actual sign up of the user (makes account)
  const handleSignup = async (e) => {
    e.preventDefault();

    // following checks make sure everything is vlaidated before the request is made to the backend
    if (!validateForm()) {
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one special character, and one digit."
      );
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address.");
      return;
    }

    try {
      let imageUrl = ""; // Initialize imageUrl variable

      // Check if an image is selected
      if (imageFile) {
        // Upload the image to Firebase and get the URL
        imageUrl = await uploadImageToFirebase(imageFile);
      }

      // after validation, user info is sent to the backend to be stored in the database
      const response = await axios.post(
        `${process.env.REACT_APP_URL2}/makeUserAccount`,
        {
          name: `${firstName} ${lastName}`,
          email: email,
          password: password,
          role: role,
          department: department,
          profilePicture: imageUrl, // Pass the URL of the uploaded image
        }
      );

      if (response.status === 200 && response.data.success) {
        setSuccessMessage("Account created successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRole("");
        setdepartment("");
        setImageFile("");
        setImagePreviewUrl("");
        navigate("/superAdminHome", { state: { id: location.state.id } });
      } else {
        console.error("Signup failed:", response.data.message);
        setServerError(response.data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      setServerError("An error occurred while processing your request.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`make-account-modal ${showModal ? "show" : ""}`}>
      <div className="make-account-container">
        <div className="title-make-account">
          <h2 className="make-account-title">Make Account</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="close-make-account-icon"
            onClick={handleClose}
          />
        </div>
        {successMessage && (
          <div className="success-message-container">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="make-account-success-icon"
            />
            <p className="make-account-success-message">{successMessage}</p>
          </div>
        )}
        <label htmlFor="profile-upload" className="profile-image-container">
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleImageUpload} // You need to define handleImageUpload function
            style={{ display: "none" }} // Hide the input element
          />
          <img
            src={imagePreviewUrl || (imageFile ? "" : avatar)}
            alt="Profile"
            className="profile-image"
          />
        </label>

        <form className="make-account-form-container" onSubmit={handleSignup}>
          <div className="make-account-form-group">
            <label className="make-account-label">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="make-account-input"
            />
            {firstNameError && (
              <p className="make-account-error-message">{firstNameError}</p>
            )}
          </div>
          <div className="make-account-form-group">
            <label className="make-account-label">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="make-account-input"
            />
            {lastNameError && (
              <p className="make-account-error-message">{lastNameError}</p>
            )}
          </div>

          <div className="make-account-form-group">
            <label className="make-account-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="make-account-input"
            />
            {emailError && (
              <p className="make-account-error-message">{emailError}</p>
            )}
            {serverError && (
              <p className="make-account-error-message">{serverError}</p>
            )}
          </div>

          <div className="make-account-form-group">
            <labe className="make-account-label" l>
              Password:
            </labe>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="make-account-input"
            />
            {passwordError && (
              <p className="make-account-error-message">{passwordError}</p>
            )}
          </div>

          <div className="make-account-form-group">
            <label className="make-account-label">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="HR Manager">HR Manager</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Employee">Employee</option>
            </select>
            {roleError && (
              <p className="make-account-error-message">{roleError}</p>
            )}
          </div>

          <div className="make-account-form-group">
            <label className="make-account-label">Department:</label>
            <select
              value={department}
              onChange={(e) => setdepartment(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="Engineering">Engineering</option>
              <option value="Application Development">
                Application Development
              </option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Security">Security</option>
              <option value="Communication">Communication</option>
              <option value="Marketing">Marketing</option>
            </select>
            {departmentError && (
              <p className="make-account-error-message">{departmentError}</p>
            )}
          </div>
          <div className="make-account-signup-button">
            <button onClick={handleSignup}>Make Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAccountModal;
