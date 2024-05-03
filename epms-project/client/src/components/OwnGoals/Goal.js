import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faClock } from "@fortawesome/free-regular-svg-icons";

const GoalItem = ({ goal, onDelete, isDragging, drag }) => {
  const handleDelete = () => {
    onDelete(goal.id);
  };

  return (
    <div ref={drag} className={`goal ${isDragging ? "dragging" : ""}`}>
      <div className="goal-header">
        <p className="goal-title">{goal.title}</p>
        <button className="delete-button" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
      <div className="goal-description">{goal.description}</div>
      <div className="goal-bottom-display">
        <div className="line"></div>
        <div className="due-date-description">
          <div style={{ fontSize: "1em", marginRight: "0.5em" }}>
            <FontAwesomeIcon icon={faClock} className="clock-icon" />
          </div>
          <span className="due-date">
            {new Date(goal.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalItem;
