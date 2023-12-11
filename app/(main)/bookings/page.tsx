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

import { Separator } from "@/components/ui/separator";
import { getBookings } from "@/actions/actions";
import Image from "next/image";

async function Bookings() {
  const bookings = await getBookings();

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Bookings</h1>
      <div className="grid grid-cols-1 grid-flow-row">
        <div className="w-full flex py-5 px-10 gap-5 border border-slate-800 rounded-lg">
          <div className="flex flex-col gap-1">
            <h1>
              {bookings[0]?.desk?.status === "available" &&
                bookings[0]?.desk?.name}{" "}
              {bookings[0]?.status}
            </h1>
            {/* <h2>
              starts: {bookings[0].startedAt.getUTCHours()}:
              {bookings[0].startedAt.getMinutes()} ends:{" "}
              {bookings[0].endedAt.getUTCHours()}:
              {bookings[0].endedAt.getMinutes()}
              <p>{formatRelative(Date.now(), bookings[0].bookedAt)}</p>
            </h2> */}
            {/* {JSON.stringify(bookings)} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;
