import { getSession } from "@/lib/next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelative } from "date-fns";
import moment from "moment";

import { Separator } from "@/components/ui/separator";
import { getBookings } from "@/actions/actions";
import Image from "next/image";

async function Bookings() {
  const bookings = await getBookings();

  // ui to be modified
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Bookings</h1>
      <div className="grid grid-cols-1 grid-flow-row gap-4">
        {bookings.map((item) => (
          <div
            key={item.id}
            className="w-full flex py-5 px-10 gap-5 border border-slate-800 rounded-lg"
          >
            <div className="flex flex-col gap-1">
              <h1>
                {item.desk?.status === "available" && item.desk?.name}{" "}
                {item.status}
              </h1>
              <h2>
                starts:{" "}
                {moment().calendar(item.startedAt, {
                  sameDay: "[Today]",
                  nextDay: "[Tomorrow]",
                  nextWeek: "dddd",
                  lastDay: "[Yesterday]",
                  lastWeek: "[Last] dddd",
                  sameElse: "DD/MM/YYYY",
                })}{" "}
                ends:{" "}
                {moment().calendar(item.endedAt, {
                  sameDay: "[Today]",
                  nextDay: "[Tomorrow]",
                  nextWeek: "dddd",
                  lastDay: "[Yesterday]",
                  lastWeek: "[Last] dddd",
                  sameElse: "DD/MM/YYYY",
                })}
                <p>{moment().calendar(item.bookedAt)}</p>
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
