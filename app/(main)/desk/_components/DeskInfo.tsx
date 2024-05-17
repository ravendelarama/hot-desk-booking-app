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
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function DeskInfo({
  name,
  image,
  status,
  area,
  booking,
  amenities,
  startedAt,
}: {
  name: string;
  image: string;
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
          <Image
            src={
              image ||
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Foffice%2520desk%2F&psig=AOvVaw38RzYrDt5v41RDtQWDrACB&ust=1716043040431000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOjlh9L0lIYDFQAAAAAdAAAAABA-"
            }
            alt="Image"
            className="rounded-md object-cover"
            width={500}
            height={500}
          />
          <div className="space-y-1">
            <div className="flex justify-between">
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
          <div className="flex justify-start items-center gap-2 flex-wrap w-full">
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
          </div>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Amentities</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto w-full flex justify-start items-center">
          
        </CardContent>
      </Card> */}
    </div>
  );
}

export default DeskInfo;
