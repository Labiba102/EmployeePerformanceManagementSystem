import React from "react";

const calculateTimeDifferenceInDays = (dueDate) => {
  const currentDate = new Date();
  const differenceInTime = new Date(dueDate) - currentDate;
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

export const generateNotifications = (role, goalList, teamData) => {
  const notifications = [];
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfFirstTwoWeeks = new Date(currentYear, currentMonth, 14);

  goalList.forEach((goal) => {
    const timeDifferenceInDays = calculateTimeDifferenceInDays(goal.date);
    if (goal.status !== "Done" && timeDifferenceInDays > 0) {
      if (timeDifferenceInDays <= 7) {
        notifications.push({
          title: goal.title,
          dueDate: goal.date,
        });
      }
      if (timeDifferenceInDays <= 1) {
        notifications.push({
          title: goal.title,
          dueDate: goal.date,
        });
      }
      if (timeDifferenceInDays <= 0) {
        notifications.push({
          title: goal.title,
          dueDate: goal.date,
        });
      }
    }
  });

  if (role === "Project Manager" || role === "HR Manager") {
    if (
      currentDate >= firstDayOfMonth &&
      currentDate <= lastDayOfFirstTwoWeeks
    ) {
      const allEvaluated = teamData.every(
        (member) => member.reviewGiven === true
      );
      if (!allEvaluated) {
        notifications.push({
          title: "Complete Evaluation Forms",
          dueDate: lastDayOfFirstTwoWeeks.toLocaleString(),
        });
      }
    }
  }
  return notifications;
};

export const getCurrentTimeGreeting = () => {
  const currentTime = new Date().getHours();

  if (currentTime >= 5 && currentTime < 12) {
    return "Good Morning";
  } else if (currentTime >= 12 && currentTime < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = Math.floor(minutes / 10) * 10;

  if (minutes === 60) {
    hours++;
    minutes = 0;
  }

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};
