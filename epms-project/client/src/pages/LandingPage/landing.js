import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import whiteLogo from "./whiteLogo.png";
import "./landing.css";
import video from "./background_video.mp4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function Landing() {

  return (
    <div className="landing">
      <video
        autoPlay
        loop
        muted
        playsInline
        src={video}
        className="landing-video"
        type="video/mp4"
      ></video>
      <div className="top-bar">
        <img src={whiteLogo} alt="Logo" className="logo" />
        <div className="contact-info">
          <FontAwesomeIcon icon={faPhone} style={{ marginRight: "10px" }} />
          042-35740280
        </div>
        <div className="email-info">
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "10px" }} />
          info@devsinc.com
        </div>
      </div>
      <div className="content-landing">
        <h1>
          We <br></br>
          Reimagine <br></br>
          Tomorrow
        </h1>
        <span>
          Molding the future through transformative change <br></br>
          <br></br>
        </span>
        <Link to="/login" className="login-button-landing">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Landing;
