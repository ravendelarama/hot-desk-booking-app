import { getSession } from "@/lib/next-auth";
import moment from "moment";
import { RedirectType, redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { GrSecure } from "react-icons/gr";

import {
  getAllBookingCount,
  getApprovedBookingAverage,
  getApprovedUserBookings,
  getMonthlyBookings,
  getPendingUserBookings,
  getUserBookingCount,
  getUserBookingReminders,
} from "@/actions/booking";
import { getAllUserCount } from "@/actions/user";
import { getAvailableDesksCount } from "@/actions/desk";
import { recentActivityLogs } from "@/actions/log";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { PiUsersThreeFill } from "react-icons/pi";
import { GiDesk } from "react-icons/gi";
import BookingGraph from "./_components/Graph";
import UserDashboard from "./_components/user-dashboard";
import Link from "next/link";
import { MdOutlineNotificationsActive } from "react-icons/md";

async function Home() {
  const totalEmployees = await getAllUserCount();
  const totalBookings = await getAllBookingCount();
  const totalUserBookings = await getUserBookingCount();
  const totalAvailableDesks = await getAvailableDesksCount();
  const recentLogs = await recentActivityLogs();
  const session = await getSession();
  const monthlyBookings = await getMonthlyBookings();
  const approvedUserBookings = await getApprovedUserBookings();
  const pendingUserBookings = await getPendingUserBookings();
  const bookingReminders = await getUserBookingReminders();
  const approvedBookingPercentage = await getApprovedBookingAverage();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-3">
      <h1 className="text-3xl font-bold font-sans">Home</h1>

      <div className="flex justify-around item-center flex-wrap gap-5">
        {session?.user?.role != Role.user && (
          <Card className="grow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center w-full">
                <p className="text-sm text-left">Total bookings</p>

                <BsFillJournalBookmarkFill className="text-slate-600 h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="pl-3 text-4xl font-bold">+{totalBookings}</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-slate-400">
                total amount of reservation as of today.
              </p>
            </CardFooter>
          </Card>
        )}
        {session?.user?.role === Role.admin ||
          (session?.user?.role == Role.superadmin && (
            <Card className="grow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <p className="text-sm text-left">Total employees</p>
                  <PiUsersThreeFill className="h-5 w-5 text-slate-600" />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p className="pl-3 text-4xl font-bold">+{totalEmployees}</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-slate-400">
                  total amount of people in the company.
                </p>
              </CardFooter>
            </Card>
          ))}

        {session?.user?.role != Role.user && (
          <Card className="grow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center w-full">
                <p className="text-sm text-left">Total available desks</p>
                <GiDesk className="h-5 w-5 text-slate-600" />
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="pl-3 text-4xl font-bold">+{totalAvailableDesks}</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-slate-400">
                total amount of available desks.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 grid-flow-row md:grid-rows-2 gap-5 h-full">
        {session?.user?.role != Role.user && (
          <Card className="row-span-2 col-span-3 md:col-span-2 h-96">
            <CardHeader>
              <CardTitle>Reservations Overview</CardTitle>
              <CardDescription>
                This shows the all the amount of bookings made for the last 4
                months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingGraph data={monthlyBookings} />
            </CardContent>
          </Card>
        )}
        {(session?.user?.role === Role.admin ||
          session?.user?.role == Role.superadmin) && (
          <Card className="row-span-2 col-start-1 md:col-start-3 col-span-3 md:col-span-1">
            <CardHeader>
              <CardTitle>
                <p className="text-[16px]">Recent user activities</p>
              </CardTitle>
              <CardDescription>As of {moment().calendar()}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLogs.map((item) => (
                <div className="w-full rounded-md p-1 space-y-1" key={item.id}>
                  <p className="text-[12px] font-semibold truncate">
                    {item.message}
                  </p>
                  <p className="text-xs text-slate-400">
                    {moment(item.occuredAt).fromNow()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      {session?.user?.role == Role.user && (
        <div className="flex flex-col item-center gap-5">
          <div className="flex gap-5 w-full flex-col sm:flex-row">
            <Card className="grow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <p className="text-sm text-left">Your total bookings</p>

                  <BsFillJournalBookmarkFill className="text-slate-600 h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="pl-3 text-4xl font-bold">+{totalUserBookings}</p>
              </CardContent>
              <CardFooter className="">
                <p className="text-xs text-slate-400">
                  Total amount of reservation you made as of today.
                </p>
              </CardFooter>
            </Card>
            <Card className="">
              <CardContent className="flex flex-col justify-center pt-5">
                <Link
                  href={"/settings/account"}
                  className="w-full rounded-md py-2 flex gap-2 items-center"
                >
                  <GrSecure className="h-5 w-5" />
                  <div className="flex flex-col gap-1 grow">
                    <p className="text-baseline font-semibold truncate">
                      Multi-Factor Authentication
                    </p>
                    <p className="text-xs text-slate-400">
                      Keep your SpotDesk account secure by enabling this
                      feature.
                    </p>
                  </div>
                </Link>
                <Link
                  href={"/settings/notification"}
                  className="w-full rounded-md py-2 flex gap-2 items-center"
                >
                  <MdOutlineNotificationsActive className="h-5 w-5" />

                  <div className="flex flex-col gap-1 grow">
                    <p className="text-baseline font-semibold truncate">
                      Email Notifications
                    </p>
                    <p className="text-xs text-slate-400">
                      Keep updated with your reservations and other reminders by
                      enabling this feature.
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
          <div className="flex w-full gap-5 flex-col sm:flex-row">
            <div className="flex flex-col item-center justify-between gap-5 sm:gap-2">
              <Card className="grow-0">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center w-full">
                    <p className="text-sm text-left">Approved Reservations</p>

                    <BsFillJournalBookmarkFill className="text-slate-600 h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">+{approvedUserBookings}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-slate-400">
                    There are {approvedBookingPercentage}% of approved
                    reservations.
                  </p>
                </CardFooter>
              </Card>
              <Card className="grow-0">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center w-full">
                    <p className="text-sm text-left">Pending Reservations</p>

                    <BsFillJournalBookmarkFill className="text-slate-600 h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">+{pendingUserBookings}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-slate-400">
                    There are {approvedBookingPercentage - 100}% pending
                    reservations.
                  </p>
                </CardFooter>
              </Card>
            </div>
            <Card className="grow">
              <CardHeader>
                <CardTitle>
                  <p className="">Booking Reminders</p>
                </CardTitle>
                <CardDescription>
                  This shows some of your upcoming reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingReminders.length > 0 &&
                  bookingReminders.map((item) => (
                    <div
                      className="flex items-center justify-between rounded-md p-2"
                      key={item.id}
                    >
                      <p className="text-sm font-semibold">
                        {item?.desk?.name} at Workspace{" "}
                        {item?.desk?.Floor.floor}
                      </p>
                      <p className="text-xs text-slate-400">
                        {moment(item.bookedAt).date() == moment().date()
                          ? "Today"
                          : moment(item.bookedAt).format("MMMM D").toString()}
                      </p>
                    </div>
                  ))}
                {bookingReminders.length == 0 && (
                  <p className="text-slate-400 text-xs">No Reminders.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
