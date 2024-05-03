import React from "react";
import { useDrop } from "react-dnd";

const DropZone = ({ status, onDrop }) => {
  // Define drop zone behavior using the useDrop hook
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "GOAL", // Specify the type of draggable items that can be dropped
    drop: (item) => onDrop(item.goal.id, status), // Callback function when item is dropped
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Flag indicating if item is over the drop zone
      canDrop: monitor.canDrop(), // Flag indicating if item can be dropped
    }),
  });

  // style the drop zone based on whether it's being hovered over and if it can accept drops
  let dropZoneClass = "drop-zone";
  if (status === "To Do") {
    dropZoneClass += " drop-zone-todo";
  } else if (status === "In Progress") {
    dropZoneClass += " drop-zone-inprogress";
  } else if (status === "Done") {
    dropZoneClass += " drop-zone-done";
  }
  if (isOver && canDrop) {
    dropZoneClass += " hover"; // Add hover effect if item can be dropped
  }

  return <div ref={drop} className={dropZoneClass}></div>; // Render the drop zone
};

export default DropZone;
