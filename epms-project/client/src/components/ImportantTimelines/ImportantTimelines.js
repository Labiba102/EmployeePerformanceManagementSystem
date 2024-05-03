import React from "react";
import { formatDate } from "../../utils/utils.js";
import imp_timelines_img1 from "./Imp_Timelines_Green_Line.png"
import imp_timelines_img2 from "./Imp_Timelines_Orange_Line.png"
import "./ImportantTimelines.css"

// this is to display the top three upcoming deadlines (goal deadlines) or automated reminders (in case of project and hr manager) for filling out evaluation forms or customizing the feedback forms 
const ImportantTimelines = ({ topThreeGoals }) => {
  return (
    <div className="important-timelines">
      <div className="timeline-heading">Important Timelines</div>
      {topThreeGoals.map((goal, index) => (
        <div
          key={index}
          className={`timeline-item ${
            index === 0
              ? "first-timeline-item"
              : index === 1
              ? "second-timeline-item"
              : index === 2
              ? "third-timeline-item"
              : ""
          }`}
        >
          <div className="important-timelines-goal-date">
            <div className="important-timelines-circle-line">
              <div
                className="timeline-circle"
                style={{
                  borderColor:
                    index === 0
                      ? "rgb(38,125,112)"
                      : index === 1
                      ? "rgb(237,116,36)"
                      : index === 2
                      ? "rgb(250,115,122)"
                      : "black",
                }}
              ></div>
              {index === 0 && (
                <img
                  src={imp_timelines_img1}
                  alt=""
                  className="important-timelines-goal-image"
                />
              )}
              {index === 1 && (
                <img
                  src={imp_timelines_img2}
                  alt=""
                  className="important-timelines-goal-image"
                />
              )}
            </div>
            <div className="important-timelines-date-and-time">
              {formatDate(goal.date)}
              <div className="important-timelines-time">
                {goal.date.substring(11, 16)}
              </div>
            </div>
          </div>
          <div className="important-timelines-separator"></div>
          <div className="important-timelines-goal-title">{goal.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ImportantTimelines;
