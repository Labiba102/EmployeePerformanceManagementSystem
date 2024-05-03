import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

const BarGraph = ({ data, labels }) => {
  ChartJS.register(BarElement, CategoryScale, LinearScale);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Not Started",
        data: data.notStarted,
        backgroundColor: "rgb(227, 132, 155)",
        borderWidth: 1,
      },
      {
        label: "In Progress",
        data: data.inProgress,
        backgroundColor: "rgb(253, 210, 119)",
        borderWidth: 1,
      },
      {
        label: "Completed",
        data: data.completed,
        backgroundColor: "rgb(138, 221, 216)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarGraph;
