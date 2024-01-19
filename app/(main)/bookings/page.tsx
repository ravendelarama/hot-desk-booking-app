import { getSession } from "@/lib/next-auth";

// import { formatRelative } from "date-fns";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { Role } from "@prisma/client";
// import { Separator } from "@/components/ui/separator";
import {
  getBookings,
  getUserBookingCount,
  getAllBookings,
  getAllBookingCount,
} from "@/actions/actions";
import ItemDialog from "./_components/ItemDialog";
import { Calendar } from "@/components/ui/calendar";
import { RedirectType, redirect } from "next/navigation";
// import Image from "next/image";
// import { Calendar } from "@/components/ui/calendar";

async function Bookings() {
  const session = await getSession();
  const bookings = await getBookings();
  const allBookings = await getAllBookings();
  const totalUserBookings = await getUserBookingCount();
  const totalBookings = await getAllBookingCount();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

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
        {session?.user?.role == Role.admin
          ? `There ${totalBookings == 1 ? "is " : "are "} ${totalBookings} `
          : `You have ${totalUserBookings} `}{" "}
        total of reservation.
      </h2>
      {session?.user?.role === Role.user ||
      session?.user.role === Role.manager ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
