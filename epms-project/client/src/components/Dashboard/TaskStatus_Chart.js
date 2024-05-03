import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

const TaskstatusChart = ({data, legendLabels}) => {
  ChartJS.register(ArcElement);
  const chartData = {
    labels: legendLabels,
    datasets: [
      {
        data: data,
        backgroundColor: ["rgb(208, 50, 88)", "rgb(253, 203, 97)", "rgb(22, 188, 178)"],
      },
    ],
  };

  const options = {
    cutout: "73%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
            color: "black",
            boxWidth: 11,
        }
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default TaskstatusChart;
