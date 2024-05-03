import React, { useEffect, useState } from "react";
import axios from "axios";
import "./kanban_goal.css";
import "./GoalFormModal.css";
import "./DeleteConfirmationModal.css";
import "./EditGoalForm.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faTableColumns,
  faClock,
  faFlag as solidFlag,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faHourglass,
  faSquareCheck,
  faTrashCan,
  faFlag as regularFlag,
} from "@fortawesome/free-regular-svg-icons";
import GoalFormModal from "./GoalFormModal.js";
import EditGoalForm from "./EditGoalForm.js";
import DeleteConfirmationModal from "./DeleteConfirmationModal.js";

import { useDrag } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import SidebarMenu from "../../Layout/SidebarMenu/SidebarMenu.js";
import DropZone from "./DropZone.js";
import GoalItem from "./Goal.js";

const OwnGoals = ({ id, role, goalList }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalToDeleteId, setGoalToDeleteId] = useState(null);

  const handleGoalButton = () => {
    setShowModal(true);
  };

  const handleEditForm = (goal) => {
    setSelectedGoal(goal);
    setShowEditForm(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeEditForm = () => {
    setSelectedGoal(null);
    setShowEditForm(false);
  }

  var todoGoals = [];
  var inProgressGoals = [];
  var doneGoals = [];

  if (Array.isArray(goalList)) {
    todoGoals = goalList
      .filter((item) => item.status === "To Do")
      .map((item) => ({
        title: item.title,
        description: item.description,
        id: item._id,
        due_date: item.date,
        own_goal: item.own_goal,
      }));

    inProgressGoals = goalList
      .filter((item) => item.status === "In Progress")
      .map((item) => ({
        title: item.title,
        description: item.description,
        id: item._id,
        due_date: item.date,
        own_goal: item.own_goal,

      }));

    doneGoals = goalList
      .filter((item) => item.status === "Done")
      .map((item) => ({
        title: item.title,
        description: item.description,
        id: item._id,
        due_date: item.date,
        own_goal: item.own_goal,
      }));
  } else {
    console.error("'data' is not an array or is undefined.");
  }

  const handleDeleteGoal = (goalId) => {
    setGoalToDeleteId(goalId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let apiUrl = "";

      if (role === "Employee") {
        apiUrl = `${process.env.REACT_APP_URL2}/deleteEmployeeGoal`;
      }

      if (role === "Project Manager") {
        apiUrl = `${process.env.REACT_APP_URL2}/deleteProjManagerGoal`;
      }

      await axios.post(apiUrl, {
        goalId: goalToDeleteId,
      });
    } catch (error) {
      console.error("Error deleting goal:", error.message);
    }
    setShowDeleteConfirmation(false);
  };

  const DraggableGoal = ({ goal, onDrop }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "GOAL",
      item: { goal },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          onDrop(item.goal.id, dropResult.status);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div ref={drag} className={`goal ${isDragging ? "dragging" : ""}`}>
        <div className="goal-header">
          <p className="goal-title">{goal.title}</p>
          <button
            className="delete-button"
            onClick={() => handleDeleteGoal(goal.id)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
        <div className="goal-description">{goal.description}</div>
        <div className="goal-bottom-display">
          <div className="line"></div>
          <div className="bottom-content">
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
            <div className="flag-icon">
              <FontAwesomeIcon
                icon={goal.own_goal? regularFlag : solidFlag}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleDrop = async (goalId, newStatus) => {
    try {
      let completionDate = null;

      if (newStatus === "Done") {
        completionDate = new Date();
      }

      await axios.post(`${process.env.REACT_APP_URL2}/updateGoalStatus`, {
        goalId,
        newStatus,
        role,
        ...(newStatus === "Done" && { completionDate }),
      });
    } catch (error) {
      console.error("Error updating goal status:", error.message);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarMenu role={role}>
        <div className="kanban-goal-main-page">
          <div className="goal-page-header">
            <span>Task Boards</span>
          </div>
          <div className="second-div">
            <div className="view-type">
              <div style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                <FontAwesomeIcon icon={faTableColumns} />
              </div>
              <span>Kanban</span>

              <div
                style={{
                  fontSize: "1.2em",
                  marginRight: "0.5em",
                  marginLeft: "2em",
                }}
              >
                <FontAwesomeIcon icon={regularFlag} />
              </div>
              <span>Personal Goals</span>

              <div
                style={{
                  fontSize: "1.2em",
                  marginRight: "0.5em",
                  marginLeft: "2em",
                }}
              >
                <FontAwesomeIcon icon={solidFlag} />
              </div>
              <span>Assigned Goals</span>
            </div>
            <div className="set-goal-button">
              <button onClick={handleGoalButton} className="button-with-icon">
                <div style={{ fontSize: "1.5em", marginRight: "0.5em" }}>
                  <FontAwesomeIcon icon={faSquarePlus} />
                </div>
                Add New Goal
              </button>
            </div>
          </div>
          <div className="boards">
            <div className="to-do-board">
              <div className="to-do-heading">
                <div style={{ fontSize: "1.3em", marginRight: "0.7em" }}>
                  <FontAwesomeIcon
                    icon={faSquare}
                    className="button-with-icon"
                  />
                </div>
                <span>To do</span>
              </div>
              <div className="to-do-goals">
                {todoGoals.map((goal) => (
                  <DraggableGoal key={goal.id} goal={goal} onDrop={handleDrop}>
                    {({ isDragging, drag }) => (
                      <GoalItem
                        key={goal.id}
                        goal={goal}
                        onDelete={handleDeleteGoal}
                        isDragging={isDragging}
                        drag={drag}
                      />
                    )}
                  </DraggableGoal>
                ))}
                <DropZone status="To Do" onDrop={handleDrop} color="todo" />
              </div>
            </div>
            <div className="in-progress-board">
              <div className="in-progress-heading">
                <div style={{ fontSize: "1.3em", marginRight: "0.7em" }}>
                  <FontAwesomeIcon
                    icon={faHourglass}
                    className="button-with-icon"
                  />
                </div>
                <span>In Progress</span>
              </div>
              <div className="in-progress-goals">
                {inProgressGoals.map((goal) => (
                  <DraggableGoal key={goal.id} goal={goal} onDrop={handleDrop}>
                    {({ isDragging, drag }) => (
                      <GoalItem
                        key={goal.id}
                        goal={goal}
                        onDelete={handleDeleteGoal}
                        isDragging={isDragging}
                        drag={drag}
                      />
                    )}
                  </DraggableGoal>
                ))}
                <DropZone status="In Progress" onDrop={handleDrop} />
              </div>
            </div>
            <div className="done-board">
              <div className="done-heading">
                <div style={{ fontSize: "1.3em", marginRight: "0.5em" }}>
                  <FontAwesomeIcon
                    icon={faSquareCheck}
                    className="button-with-icon"
                  />
                </div>
                <span>Done</span>
              </div>
              <div className="done-goals">
                {doneGoals.map((goal) => (
                  <DraggableGoal key={goal.id} goal={goal} onDrop={handleDrop}>
                    {({ isDragging, drag }) => (
                      <GoalItem
                        key={goal.id}
                        goal={goal}
                        onDelete={handleDeleteGoal}
                        isDragging={isDragging}
                        drag={drag}
                      />
                    )}
                  </DraggableGoal>
                ))}
                <DropZone status="Done" onDrop={handleDrop} />
              </div>
            </div>
          </div>
          <GoalFormModal
            role={role}
            showModal={showModal}
            closeModal={closeModal}
          />

          <EditGoalForm
              goal={selectedGoal}
              showModal={showEditForm}
              closeModal={closeEditForm}
          />

          <DeleteConfirmationModal
            showModal={showDeleteConfirmation}
            handleConfirm={handleConfirmDelete}
            handleClose={() => setShowDeleteConfirmation(false)}
          />

        </div>
      </SidebarMenu>
    </DndProvider>
  );
};

export default OwnGoals;
