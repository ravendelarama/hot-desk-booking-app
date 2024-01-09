import {
  getAllBookingCount,
  getAllUserCount,
  getAvailableDesksCount,
  getDesks,
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
import { getSession } from "@/lib/next-auth";
import moment from "moment";
import { RedirectType, redirect } from "next/navigation";

async function Home() {
  const totalEmployees = await getAllUserCount();
  const totalBookings = await getAllBookingCount();
  const totalAvailableDesks = await getAvailableDesksCount();
  const session = await getSession();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Home</h1>
      <div className="flex justify-around item-center flex-wrap gap-5">
        <Card className="grow">
          <CardHeader>
            <CardTitle>
              <p className="text-sm text-left">Total Bookings</p>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pl-3 text-3xl font-bold">{totalBookings}</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-400">
              total amount of reservation as of today.
            </p>
          </CardFooter>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>
              <p className="text-sm text-left">Total Employees</p>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pl-3 text-3xl font-bold">{totalEmployees}</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-400">
              total amount of people in the company.
            </p>
          </CardFooter>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>
              <p className="text-sm text-left">Total available desks</p>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pl-3 text-3xl font-bold">{totalAvailableDesks}</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-400">
              total amount of available desks.
            </p>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 grid-flow-row md:grid-rows-2 gap-5 h-full">
        <Card className="row-span-2 col-span-3 md:col-span-2 h-96">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <Card className="row-span-2 col-start-1 md:col-start-3 col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>
              <p className="text-[16px]">Upcoming reservations</p>
            </CardTitle>
            <CardDescription>As of {moment().calendar()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* <div className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-4 space-y-1">
              <p className="text-[12px] font-semibold">
                John Doe has checked in.
              </p>
              <p className="text-xs text-slate-400">{moment().fromNow()}</p>
            </div>
            <div className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-4 space-y-1">
              <p className="text-[12px] font-semibold">
                John Doe has checked in.
              </p>
              <p className="text-xs text-slate-400">{moment().fromNow()}</p>
            </div>
            <div className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-4 space-y-1">
              <p className="text-[12px] font-semibold">
                John Doe has checked in.
              </p>
              <p className="text-xs text-slate-400">{moment().fromNow()}</p>
            </div> */}
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Home;
