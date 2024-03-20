import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";
import { Role } from "@prisma/client";

import {
  getBookings,
  getUserBookingCount,
  getAllBookings,
  getAllBookingCount,
} from "@/actions/booking";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import ItemDialog from "./_components/ItemDialog";

async function Bookings() {
  const session = await getSession();
  const bookings = await getBookings();
  const allBookings = await getAllBookings();
  const totalUserBookings = await getUserBookingCount();
  const totalBookings = await getAllBookingCount();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">
        {session?.user?.role === Role.admin ||
        session?.user?.role === Role.manager
          ? "Bookings"
          : "My Bookings"}
      </h1>
      <h2 className="text-slate-500 text-sm">
        {session?.user?.role == Role.admin || session?.user.role == Role.manager
          ? `There ${totalBookings == 1 ? "is " : "are "} ${totalBookings} `
          : `You have ${totalUserBookings} `}{" "}
        total of reservation.
      </h2>
      {session?.user?.role === Role.user ||
      session?.user.role === Role.manager ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* @ts-ignore */}
          {bookings.map((item) => (
            <ItemDialog key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={allBookings} />
      )}
    </div>
  );
}

export default Bookings;
