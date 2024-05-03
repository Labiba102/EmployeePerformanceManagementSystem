import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./approveComments.css";

const ApproveCommentsModal = ({
  showModal,
  closeModal,
  department,
  departmentExists,
  email,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [commentsToApprove, setCommentToApprove] = useState([]);
  const [loading, setLoading] = useState(true);

  //   console.log(location.state.id)

  const handleClose = () => {
    closeModal();
  };

  const getCommentsToApprove = async () => {
    // console.log("Department: ", department)
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL2}/getComments`,
        {
          department: department,
        }
      );

      // console.log(res.status.message)
      if (res.status === 200) {
        // console.log(res.data.commentsToApprove)
        setCommentToApprove(res.data.commentsToApprove);
      } else {
        console.error("Failed to get comments:", res.statusText);
        return null;
      }
    } catch (error) {
      console.log("Error while getting comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentExists) {
      getCommentsToApprove();
    }
  }, [departmentExists]);

  const handleApprove = async (e, comment) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL2}/saveApproved`,
        {
          comment: comment,
        }
      );
      location.state.id = email;
      console.log(location.state.id);

      if (res.status === 200) {
        setCommentToApprove((prevComments) =>
          prevComments.filter((c) => c !== comment)
        );
      } else {
        console.error("Failed to save comment status:", res.statusText);
        // return null;
      }
    } catch (error) {
      console.log("Failed to save comment status:", error.message);
    }
  };

  return (
    <div className={`approve-comment-modal ${showModal ? "show" : ""}`}>
      <div className="approve-comment-modal-content">
        <div className="approve-comment-modal-top">
          <p className="approve-comment-modal-title">
            Approve Anonymous Comments
          </p>
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="approve-comment-modal-close-icon"
            onClick={handleClose}
          />
        </div>
        <form className="approve-comment-modal-form">
          {loading && <p className="loading-comments">Loading comments...</p>}
          {!loading && commentsToApprove.length === 0 && (
            <p className="no-comments-to-approve">No comments to approve.</p>
          )}
          {!loading && commentsToApprove.length > 0 && (
            <ul className="comment-list">
              {commentsToApprove.map((comment, index) => (
                <div key={index} className="comment-item">
                  <p className="comment-desc"><strong>{index + 1}. </strong> {comment.comment}</p>
                  <button
                    className="approve-button"
                    onClick={(e) => handleApprove(e, comment)}
                  >
                    Approve
                  </button>
                </div>
              ))}
            </ul>
          )}
        </form>
      </div>
      {showModal && <div className="blur-background"></div>}
    </div>
  );
};

export default ApproveCommentsModal;
