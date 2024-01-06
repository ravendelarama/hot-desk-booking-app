import { getSession } from "@/lib/next-auth";

// import { formatRelative } from "date-fns";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { Role } from "@prisma/client";
// import { Separator } from "@/components/ui/separator";
import { getBookings, getUserBookingCount } from "@/actions/actions";
import ItemDialog from "./_components/ItemDialog";
import { Calendar } from "@/components/ui/calendar";
// import Image from "next/image";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((item) => (
            <ItemDialog key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={bookings} />
      )}
    </div>
  );
}

export default Bookings;
