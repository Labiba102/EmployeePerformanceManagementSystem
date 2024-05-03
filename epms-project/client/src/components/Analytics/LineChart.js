import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler 
} from "chart.js";


const LineChart = ({ data, labels }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler 
  );


  const chartData = {
    labels: labels,
    datasets: [
        {
          label: "Tasks Completed",
          data: data,
          borderColor: "rgb(31, 160, 138)",
          backgroundColor: "rgba(31, 200, 138)",
          fill: {
            target: "origin", 
            above: "rgba(31, 160, 138, 0.3)"
          }
        },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    tension: 0
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
