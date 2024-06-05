import { getSession } from "@/lib/next-auth";
import { RedirectType, redirect } from "next/navigation";
import { Role } from "@prisma/client";

import {
  getUserBookingCount,
  getAllBookings,
  getAllBookingCount,
  getBookings,
} from "@/actions/booking";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import UserBookings from "./_components/user-bookings";

async function Bookings() {
  const session = await getSession();
  const allBookings = await getAllBookings();
  const totalUserBookings = await getUserBookingCount();
  const totalBookings = await getAllBookingCount();
  const userBookings = await getBookings();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  if (
    session?.user?.role === Role.user ||
    session?.user.role === Role.manager
  ) {
    return (
      <div className="">
        <UserBookings bookings={userBookings} />
      </div>
    );
  }
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

      <DataTable columns={columns} data={allBookings} />
    </div>
  );
}

export default Bookings;
