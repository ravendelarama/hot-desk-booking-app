import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@prisma/client";
import { getSession } from "next-auth/react";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { GiDesk } from "react-icons/gi";
import { PiUsersThreeFill } from "react-icons/pi";

async function HomeLoadingPage() {
  const session = await getSession();

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Loading</h1>
      <div className="flex justify-around item-center flex-wrap gap-5">
        <Card className="grow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center w-full">
              <Skeleton className="h-7 w-1/2 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full rounded-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/2 rounded-full" />
          </CardFooter>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center w-full">
              <Skeleton className="h-7 w-1/2 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full rounded-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/2 rounded-full" />
          </CardFooter>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center w-full">
              <Skeleton className="h-7 w-1/2 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full rounded-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/2 rounded-full" />
          </CardFooter>
        </Card>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 grid-flow-row md:grid-rows-2 gap-5 h-full">
        <Card className="row-span-2 col-span-3 md:col-span-2 h-96">
          <CardHeader className="flex flex-col gap-2">
            <Skeleton className="w-1/2 h-7 rounded-full" />
            <Skeleton className="w-3/4 h-5 rounded-full" />
          </CardHeader>
          <CardContent className="flex justify-center items-center w-full">
            <Skeleton className="w-[80%] h-56 rounded-md" />
          </CardContent>
        </Card>
        <Card className="row-span-2 col-start-1 md:col-start-3 col-span-3 md:col-span-1">
          <CardHeader>
            <Skeleton className="w-1/2 h-4 rounded-full" />
            <Skeleton className="w-1/2 h-3 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-md p-2 space-y-1">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-20 h-3 rounded-full" />
            </div>
            <div className="w-full rounded-md p-2 space-y-1">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-20 h-3 rounded-full" />
            </div>
            <div className="w-full rounded-md p-2 space-y-1">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-20 h-3 rounded-full" />
            </div>
            <div className="w-full rounded-md p-2 space-y-1">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-20 h-3 rounded-full" />
            </div>
            <div className="w-full rounded-md p-2 space-y-1">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-20 h-3 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HomeLoadingPage;
