import React from "react";
import "./DeleteTeamModal.css";

// a modal when user selects to delete a goal, asks for confirmation 
function DeleteTeamModal({ showModal, handleConfirm, handleClose }) {

  // if showModal prop is false, it does not render anything
  if (!showModal) return null;

  return (
    <div className="delete-team-modal">
      <p className="delete-team-question">
        Are you sure you want to delete this team?
      </p>
      <div className="delete-team-modal-buttons">
        <button onClick={handleConfirm}>Yes</button> {/* button to confirm deletion */}
        <button onClick={handleClose}>No</button> {/* button to cancel deletion */}
      </div>
    </div>
  );
}

export default DeleteTeamModal;
