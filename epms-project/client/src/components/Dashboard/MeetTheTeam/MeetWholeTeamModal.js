import React from "react"
import pfp_anon from "./general_anon_pfp.png"
import "./MeetWholeTeamModal.css"

// this is the modal displayed when either the project manager or the hr manager click on 'see all' in the 'meet the team' part on their dashboards
// displays profile picture, name and role of all team members
const MeetTheWholeTeamModal = ({ teamMembers, showModal, closeModal }) => {

  const chunkedMembers = chunkArray(teamMembers, 3);

  return (
    <div className={`modal ${showModal ? "show" : ""}`}>
      <div className="mtt-modal-content">
        <div className="modal-header">
          <h2>Meet The Team</h2>
          <span className="mtt-close-icon" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="mtt-modal-body">
          {chunkedMembers.map((chunk, index) => (
            <div key={index} className="row">
              {chunk.map((member) => (
                <div key={member._id} className="mtt-member-info">
                  <div className="mtt-team-member-image-modal">
                    <img src={pfp_anon} alt="Profile" className="mtt-image-properties-modal" />
                  </div>
                  <div className="mtt-member-details-modal">
                    <div className="mtt-member-name-modal">
                      <p>{member.name}</p>
                    </div>
                    <div className="mtt-member-role-modal">
                      <p>{member.role}</p> 
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {showModal && <div className="blur-background"></div>}
    </div>
  );
};

export default MeetTheWholeTeamModal;


// helper function to chunk array into smaller arrays (we want to display 3 members per row)
function chunkArray(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
}