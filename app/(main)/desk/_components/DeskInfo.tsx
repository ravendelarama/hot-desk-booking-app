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
    <>
      <Card className="w-full lg:w-1/2 h-fit">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {status == DeskStatus.available
              ? booking.length > 0 &&
                booking[0].startedAt.getDate() == startedAt.getDate()
                ? "occupied"
                : "available"
              : DeskStatus.unavailable}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            {booking?.length > 0 &&
              booking[0].startedAt.getDate() == startedAt.getDate() && (
                <div className="border rounded-lg px-4 py-2 w-fit flex justify-start items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {booking[0]?.user?.firstName.charAt(0)}
                      {booking[0]?.user?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs">
                      {booking[0]?.user?.firstName} {booking[0]?.user?.lastName}
                    </p>
                    <p className="text-xs text-ghost font-semibold">
                      {booking[0]?.user?.email}
                    </p>
                  </div>
                </div>
              )}
            <h4>Workspace area: {area}</h4>
            {booking?.length > 0 &&
              booking[0].startedAt.getDate() == startedAt.getDate() && (
                <>
                  <p>Reservation: {booking[0]?.bookedAt?.toDateString()!}</p>
                  <p>Starts at: {booking[0]?.startedAt?.toDateString()!}</p>
                </>
              )}
          </div>
          <Separator orientation="horizontal" />

          <h4 className="text-sm font-semibold">Amenities</h4>
          <div className="flex justify-start items-center gap-2 flex-wrap">
            {amenities?.length > 0 &&
              amenities?.map((item, index) => {
                return (
                  <Badge key={index} variant={"secondary"}>
                    {item}
                  </Badge>
                );
              })}
            <Badge variant={"secondary"}>Sample</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <p></p>
        </CardFooter>
      </Card>
    </>
  );
}

export default DeskInfo;
