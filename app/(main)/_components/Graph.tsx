"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { Bar } from "react-chartjs-2";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip
);

export default function BookingGraph({
  data,
}: {
  data: (boolean | undefined)[][];
}) {
  const month4 = moment().subtract(4, "months").format("MMM");
  const month3 = moment().subtract(3, "months").format("MMM");
  const month2 = moment().subtract(2, "months").format("MMM");
  const month1 = moment().subtract(1, "month").format("MMM");

  console.log(data);

  return (
    <div className="flex justify-center items-center w-full h-64">
      <Bar
        datasetIdKey="id"
        data={{
          labels: [month4, month3, month2, month1],
          datasets: [
            {
              label: "Bookings",
              backgroundColor: "#53BDFF",
              borderRadius: 5,
              data: [
                data[3].length,
                data[2].length,
                data[1].length,
                data[0].length,
              ],
            },
          ],
        }}
      />
    </div>
  );
}
