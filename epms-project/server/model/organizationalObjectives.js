import mongoose from "mongoose";

import { Goals, ProjManagerGoals } from "../schemas/useCaseSchema.js";

const predefinedObjectives = [
  "Increase revenue by 10%",
  "Increase customer satisfaction",
  "Increase product quality",
  "Improve customer support",
  "Identify potential partners",
  "Increase market share",
  "Increase brand awareness",
  "Improve employee satisfaction",
];

const calculateAssignedCount = async (req, res) => {
  try {
    // aggregating the count of assigned employees for each org objective in the Goals collection
    const employeeCounts = await Goals.aggregate([
      { $match: { org_objectives: { $in: predefinedObjectives } } },
      { $group: { _id: "$org_objectives", count: { $sum: 1 } } },
    ]);

    // aggregating the count of assigned project managers for each org objective in the ProjManagerGoals collection
    const projManagerCounts = await ProjManagerGoals.aggregate([
      { $match: { org_objectives: { $in: predefinedObjectives } } },
      { $group: { _id: "$org_objectives", count: { $sum: 1 } } },
    ]);

    // merging the counts from both collections
    const assignedCounts = {};
    employeeCounts.forEach(({ _id, count }) => {
      assignedCounts[_id] = (assignedCounts[_id] || 0) + count;
    });
    projManagerCounts.forEach(({ _id, count }) => {
      assignedCounts[_id] = (assignedCounts[_id] || 0) + count;
    });

    // console.log(assignedCounts);
    // return assignedCounts;
    return res
      .status(200)
      .json({ success: true, assignedCounts: assignedCounts });
  } catch (error) {
    console.error("Error calculating assigned counts:", error.message);
    res.status(500).json({ success: false, message: "Error getting count" });
  }
};

export { calculateAssignedCount };
