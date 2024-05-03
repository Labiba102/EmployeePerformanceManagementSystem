import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";

const DoughnutChart = ({ percentage, color }) => {
  ChartJS.register(ArcElement);
  const data = {
    labels: ["Progress", "Remaining"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "lightgray"],
      },
    ],
  };

  const options = {
    cutout: "60%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
