import { getSession } from "@/lib/next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { formatRelative } from "date-fns";
import moment from "moment";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

// import { Separator } from "@/components/ui/separator";
import { getBookings, getUserBookingCount } from "@/actions/actions";
// import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Role } from "@prisma/client";
// import { Calendar } from "@/components/ui/calendar";

async function Bookings() {
  const session = await getSession();
  const bookings = await getBookings();
  const totalUserBookings = await getUserBookingCount();

  // ui to be modified
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">
        {session?.user?.role === Role.admin ||
        session?.user?.role === Role.manager
          ? "Bookings"
          : "My Bookings"}
      </h1>
      <h2 className="text-slate-500 text-sm">
        You have {totalUserBookings} total amount of reservation as of now.
      </h2>
      {session?.user?.role === Role.user ? (
        <div className="grid grid-cols-1 grid-flow-row gap-4">
          {bookings.map((item) => (
            <div
              key={item.id}
              className="w-full flex py-5 px-10 gap-5 border border-slate-800 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <h1>{item.desk?.name}</h1>
                <Badge
                  className="w-fit"
                  variant={
                    item.status === "checked_in"
                      ? "default"
                      : item.status === "canceled"
                      ? "destructive"
                      : item.status === "checked_out"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {item.status}
                </Badge>
                <h2>
                  {/* starts: {moment().calendar(item.startedAt)} ends:{" "}
                {moment().calendar(item.endedAt)} */}
                  <p>Booking Date: {moment(item.bookedAt).fromNow()}</p>
                </h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={bookings} />
      )}
    </div>
  );
}

export default Bookings;
