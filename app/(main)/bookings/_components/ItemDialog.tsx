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

function ItemDialog({ item }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
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
            <div className="">
              <Calendar
                mode="single"
                className="border rounded-md overflow-auto scroll-m-0"
                style={{
                  height: 350,
                }}
                styles={{
                  head_cell: {
                    width: 60,
                    textAlign: "center",
                  },
                  cell: {
                    width: 60,
                    height: 45,
                  },
                  day: {
                    width: 60,
                    height: 45,
                  },
                }}
                selected={item.occuredAt}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
  );
}

export default ItemDialog;
