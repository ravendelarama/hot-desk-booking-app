import { getSession } from "@/lib/next-auth";
import moment from "moment";
import { RedirectType, redirect } from "next/navigation";
import { Role } from "@prisma/client";

import {
  getAllBookingCount,
  getMonthlyBookings,
  getUserBookingCount,
  getUserCheckInCount,
  getUserUpcomingReservation,
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

async function Home() {
  const totalEmployees = await getAllUserCount();
  const totalBookings = await getAllBookingCount();
  const totalUserBookings = await getUserBookingCount();
  const totalAvailableDesks = await getAvailableDesksCount();
  const recentLogs = await recentActivityLogs();
  const userCheckins = await getUserCheckInCount();
  const session = await getSession();
  const monthlyBookings = await getMonthlyBookings();

  if (session?.user.isBanned) redirect("/signin", RedirectType.replace);

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Home</h1>
      {session?.user?.role === Role.admin ? (
        <>
          <div className="flex justify-around item-center flex-wrap gap-5">
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
            <Card className="grow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <p className="text-sm text-left">Total available desks</p>
                  <GiDesk className="h-5 w-5 text-slate-600" />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p className="pl-3 text-4xl font-bold">
                  +{totalAvailableDesks}
                </p>
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
            <Card className="row-span-2 col-start-1 md:col-start-3 col-span-3 md:col-span-1">
              <CardHeader>
                <CardTitle>
                  <p className="text-[16px]">Recent user activities</p>
                </CardTitle>
                <CardDescription>As of {moment().calendar()}</CardDescription>
              </CardHeader>
              <CardContent>
                {recentLogs.map((item) => (
                  <div
                    className="w-full rounded-md p-1 space-y-1"
                    key={item.id}
                  >
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
          </div>
        </>
      ) : (
        <>
          <div className="flex item-center flex-wrap gap-5">
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
              <CardFooter>
                <p className="text-xs text-slate-400">
                  Total amount of reservation you made as of today.
                </p>
              </CardFooter>
            </Card>
            <Card className="grow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <p className="text-sm text-left">Total check-ins</p>
                  <PiUsersThreeFill className="h-5 w-5 text-slate-600" />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p className="pl-3 text-4xl font-bold">+{userCheckins}</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-slate-400">
                  Total amount of your checked ins.
                </p>
              </CardFooter>
            </Card>
            {/* <Card className="w-full lg:w-1/2">
              <CardHeader>
                <CardTitle>
                  <p className="text-[16px]">Upcoming Reservation</p>
                </CardTitle>
                <CardDescription>As of {moment().calendar()}</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingReservations.length > 0 ? (
                  upcomingReservations.map((item) => (
                    <div
                      className="w-full rounded-md p-1 space-y-1"
                      key={item.id}
                    >
                      {moment(item.startedAt) > moment() ? (
                        <p className="py-2 text-sm">
                          <span className="text-sm font-bold">
                            {item.desk.name}
                          </span>{" "}
                          will be available {moment(item.startedAt).fromNow()}
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div>No upcoming reservation.</div>
                )}
              </CardContent>
            </Card> */}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
