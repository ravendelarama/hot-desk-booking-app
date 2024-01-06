"use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ImageMapper, { MapAreas } from "react-img-mapper";
import { cn } from "@/lib/utils";
import { Suspense, useState, useRef, useLayoutEffect } from "react";
import { Desk, DeskStatus } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import useDesks from "@/hooks/useDesks";
import useBook from "@/hooks/useBook";
import Loading from "./Loading";
import moment from "moment";

import { toast } from "@/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

type Prop = {
  floor: String | null;
  desks: Pick<Desk, "id" | "name" | "coordinates" | "status">[];
  image: string | null;
  date: Date | null;
};

function DeskMap({ floor, desks, image, date }: Prop) {
  const { selectedDesk, setSelectedDesk } = useDesks();
  const { setBook, setDate, handleBooking } = useBook();
  const [prevDesk, setPrevDesk] = useState<any>(null);

  const [width, setWidth] = useState<number>(0);
  const ref = useRef(null);
  // const hoverRef = useRef(null);

  const list = [] as MapAreas[];

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
  }, []);

  desks.forEach((item, index) => {
    list[index] = {
      id: item.id,
      coords: item.coordinates,
      shape: "circle",
      preFillColor:
        item.status === DeskStatus.available ? "#00ff194c" : "#e62012aa",
      lineWidth: 3,
      strokeColor: "#000000",
      fillColor: item.status === DeskStatus.available ? "#179920" : "#991f37",
    };
  });

  function book() {
    handleBooking();
    toast({
      title: "Booking",
      description: (
        <p className="text-sm">Your reservation has been created.</p>
      ),
    });
  }
  // show status if reserved
  // dialog to be modified
  return (
    <>
      <div ref={ref} className="w-full">
        {date && date.getDate()}
      </div>

      <h1>{selectedDesk && selectedDesk.name}</h1>

      <div className="border rounded-md overflow-auto">
        {image ? (
          <ImageMapper
            responsive={true}
            parentWidth={width!}
            natural={true}
            src={image!}
            onClick={(e) => {
              if (e.fillColor != "#991f37") {
                const idx = desks.findIndex((item, i) => {
                  // finds the clicked desk
                  if (e.id === item.id) {
                    return true;
                  }
                });
                setSelectedDesk(desks[idx]);
                e.fillColor = "#2EB5C7";
              }
            }}
            map={{
              name: "desk-map",
              areas: list,
            }}
          />
        ) : (
          <Loading />
        )}
      </div>
      {/* <HoverCard>
        <HoverCardTrigger asChild>
          <Button ref={hoverRef}>Click</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        </HoverCardContent>
      </HoverCard> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-sm w-16 px-2"
            disabled={!floor && !date && !selectedDesk}
            onClick={() => {
              setBook(selectedDesk!);
              setDate(date!);
            }}
          >
            Book
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-2 py-4">
                <p>Desk Name: {selectedDesk?.name}</p>
                <p>Status: {selectedDesk?.status}</p>
                <p>Starts {moment(date).toNow()}</p>
                <p>Until: {moment(date).toNow()} </p>
              </div>
              <Separator />
              <p className="py-4">
                This action cannot be undone. If you want to cancel your
                reservation, please go to the bookings page.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"secondary"} className="text-sm">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={book} variant="success" className="text-sm">
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeskMap;
