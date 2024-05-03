import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import "./NotifBar.css";

// this is the most common component that has to be displayed on each page. it gets passed the notifications in the form of an array, and displays them in a dropdown when the bell icon is clicked (which is automatically adjusted depending on where the component is called)

// it is called on every page since the bell has to displayed on all pages
const NotifBar = ({ notifications }) => {
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  // checks whether to show dropdown or not depending on whether the bell icon is clicked or not
  const [showDropdown, setShowDropdown] = useState(false);

  // useEffect is used here to update displayed notifications when the 'notifications' prop changes
  useEffect(() => {
    if (notifications) {
      setDisplayedNotifications(notifications);
    }
  }, [notifications]); //reruns when the prop changes

  const handleBellClick = () => {
    // toggling dropdown visibility
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notif-profile">
      <div className="bell-icon" onClick={handleBellClick}>
        <FontAwesomeIcon
          icon={faBell}
          className={
            notifications && notifications.length > 0 ? "has-notifications" : ""
          }
        />
        {/* indicator if notifications exist */}
        {notifications && notifications.length > 0 && (
          <div className="notification-indicator">{notifications.length}</div>
        )}
      </div>
      {/* dropdown for notifications */}
      {showDropdown && (
        <div className="notification-dropdown">
          <p className="notifications-heading">Notifications</p>
          {/* render notifications or a message if no notifications */}
          {displayedNotifications.length === 0 ? (
            <div className="notification-item">
              <div className="notification-item-caught-up">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ marginRight: "4%" }}
                  className="caught-up-icon"
                />
                <p>You are all caught up for now!</p>
              </div>
            </div>
          ) : (
            // map through notifications and render each one
            displayedNotifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <div className="upcoming-notification">
                  <strong>Upcoming:</strong>&nbsp;{notification.title}
                </div>
                <div className="due-date-notif">
                  Deadline: {notification.dueDate}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotifBar;
