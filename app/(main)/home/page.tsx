import {
  getAllBookingCount,
  getAllUserCount,
  getOtherUsers,
  getUserBookingCount,
} from "@/actions/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

async function Home() {
  const totalEmployees = await getAllUserCount();
  const totalBookings = await getAllBookingCount();
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Home</h1>
      <h2>Employees: {totalEmployees}</h2>
      <h2>Bookings: {totalBookings}</h2>
      <h2></h2>
    </div>
  );
}

export default Home;
