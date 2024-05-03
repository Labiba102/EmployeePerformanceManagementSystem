import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

// component for the common quote box on all user's dashboards
const QuoteBox = () => {
  return (
    <div className="quote-box centered-text">
      <div style={{ fontSize: "2em", alignSelf: "flex-start" }}>
        <FontAwesomeIcon icon={faQuoteLeft} />
      </div>
      <p className="quote-text">
        The only thing worth doing is what you do for others.
      </p>
      <div style={{ fontSize: "2em", alignSelf: "flex-end" }}>
        <FontAwesomeIcon icon={faQuoteRight} />
      </div>
    </div>
  );
};

export default QuoteBox;
