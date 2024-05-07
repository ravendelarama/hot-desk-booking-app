"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DeskStatus } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GrMap, GrScheduleNew } from "react-icons/gr";
import { PiOfficeChair } from "react-icons/pi";
import { BsFillJournalBookmarkFill } from "react-icons/bs";

function DeskInfo({
  name,
  status,
  area,
  booking,
  amenities,
  startedAt,
}: {
  name: string;
  status: DeskStatus;
  area: string | undefined;
  booking: {
    user: {
      firstName: string;
      lastName: string;
      email: string | null;
      image: string | null;
    };
    startedAt: Date;
    bookedAt: Date;
  }[];
  amenities: string[];
  startedAt: Date;
}) {
  return (
    <div className="w-full lg:w-[40%] flex flex-col justify-start gap-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <p className="flex gap-1 items-center">
              <PiOfficeChair className="h-6 w-6 " />
              <span className="text-xl">{name}</span>
            </p>
            <Badge
              variant={
                status == DeskStatus.available
                  ? booking.length > 0 &&
                    booking[0].startedAt.getDate() == startedAt.getDate()
                    ? "warning"
                    : "success"
                  : "destructive"
              }
            >
              {status == DeskStatus.available
                ? booking.length > 0 &&
                  booking[0].startedAt.getDate() == startedAt.getDate()
                  ? "occupied"
                  : "available"
                : DeskStatus.unavailable}
            </Badge>
          </CardTitle>
          <CardDescription>
            {booking?.length > 0 &&
              booking[0].startedAt.getDate() == startedAt.getDate() && (
                <div className=" rounded-lg w-full flex justify-start items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {booking[0]?.user?.firstName.charAt(0)}
                      {booking[0]?.user?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-ghost font-semibold">
                      {booking[0]?.user?.firstName} {booking[0]?.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking[0]?.user?.email}
                    </p>
                  </div>
                </div>
              )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex flex-col items-start gap-1">
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <GrMap className="h-4 w-4 " />
                {area}
              </p>
              {booking?.length > 0 &&
                booking[0].startedAt.getDate() == startedAt.getDate() && (
                  <>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <BsFillJournalBookmarkFill className="h-4 w-4" />{" "}
                      {booking[0]?.bookedAt?.toDateString()!}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <GrScheduleNew className="h-4 w-4" />{" "}
                      {booking[0]?.startedAt?.toDateString()!}
                    </p>
                  </>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Amentities</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-start items-center gap-2 flex-wrap">
            {amenities?.length > 0 ? (
              amenities?.map((item, index) => {
                return (
                  <Badge key={index} variant={"secondary"}>
                    {item}
                  </Badge>
                );
              })
            ) : (
              <p className="text-2xl text-gray-400">Select a desk</p>
            )}
            <Badge variant={"secondary"}>Desk Lamp</Badge>

            <Badge variant={"secondary"}>Dual Monitors</Badge>

            <Badge variant={"secondary"}>Ergonomic Chair</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DeskInfo;
