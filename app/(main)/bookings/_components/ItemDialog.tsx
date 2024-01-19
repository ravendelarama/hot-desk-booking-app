"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import moment from "moment";
import { Role } from "@prisma/client";
import { MdCancel } from "react-icons/md";
import { FaCircleCheck, FaRegCircleCheck } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { cancelBooking, checkIn, checkOut } from "@/actions/actions";
import { Calendar } from "@/components/ui/calendar";
import { useLayoutEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

function ItemDialog({ item }: any) {
  const [calendarWidth, setCalendarWidth] = useState<number>(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    // @ts-ignore
    // setCalendarWidth(ref?.current?.value.offsetWidth!);
  }, []);

  return (
    <div ref={ref} className="w-full">
      <Dialog>
        <DialogTrigger className="cursor-pointer" asChild>
          <div className="w-full flex flex-col py-5 px-10 gap-5 border border-slate-800 rounded-lg">
            <div className="flex justify-between gap-1">
              <h1>{item.desk?.name}</h1>
              <h2>
                <p className="text-gray-500 text-sm">
                  {moment(item.bookedAt).fromNow()}
                </p>
              </h2>
            </div>
            <div className="flex flex-col justify-start item-center gap-4">
              <p className="text-gray-500 text-sm font-bold">
                {moment().date() > moment(item.occuredAt).date()
                  ? "Your reserved desk has expired " +
                    moment(item.occuredAt).fromNow()
                  : moment().date() == moment(item.occuredAt).date()
                  ? "Your desk is now available, your reservation is available " +
                    moment().subtract(1, "day").toNow()
                  : "Your desk will be available " +
                    moment(item.occuredAt).fromNow()}
              </p>
              <Badge
                className="w-fit"
                variant={
                  item.status === "no_show"
                    ? "default"
                    : item.status === "canceled"
                    ? "destructive"
                    : item.status === "checked_out"
                    ? "secondary"
                    : item.status === "checked_in"
                    ? "success"
                    : "warning"
                }
              >
                {item.status}
              </Badge>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {/* @ts-ignore */}
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <h1>Desk: {item.desk.name}</h1>
              <h2>Reservation Date: {moment(item.bookedAt).calendar()}</h2>
              <Badge
                className="w-fit"
                variant={
                  item.status === "no_show"
                    ? "default"
                    : item.status === "canceled"
                    ? "destructive"
                    : item.status === "checked_out"
                    ? "secondary"
                    : item.status === "checked_in"
                    ? "success"
                    : "warning"
                }
              >
                {item.status}
              </Badge>
              <div className="w-full flex justify-center items-center">
                <ScrollArea className="border rounded-md w-fit flex justify-center items-center">
                  <Calendar
                    mode="single"
                    className="flex justify-center items-center"
                    style={{
                      height: 350,
                    }}
                    styles={{
                      head_cell: {
                        width: 40,
                        textAlign: "center",
                      },
                      cell: {
                        width: 40,
                        height: 40,
                      },
                      day: {
                        width: 40,
                        height: 40,
                      },
                    }}
                    selected={item.occuredAt}
                  />
                </ScrollArea>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row flex-end">
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                className="text-sm"
                size={"icon"}
                disabled={item.status != "waiting"}
                onClick={async () => {
                  await cancelBooking(item.id);
                  toast({
                    title: "Bookings",
                    description: "You canceled a reservation.",
                  });
                }}
              >
                <MdCancel className="h-4 w-4" />
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant={item.status == "waiting" ? "success" : "secondary"}
                className="text-sm"
                size={"icon"}
                disabled={
                  (item.status != "waiting" && item.status != "checked_in") ||
                  moment() < moment(item.occuredAt)
                }
                onClick={async () => {
                  if (item.status === "waiting") {
                    await checkIn(item.id);
                    toast({
                      title: "Bookings",
                      description: "You have checked in.",
                    });
                  } else {
                    await checkOut(item.id);
                    toast({
                      title: "Bookings",
                      description: "You have checked out.",
                    });
                  }
                }}
              >
                {item.status === "checked_in" ? (
                  <FaRegCircleCheck className="h-4 w-4" />
                ) : (
                  <FaCircleCheck className="h-4 w-4" />
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ItemDialog;
