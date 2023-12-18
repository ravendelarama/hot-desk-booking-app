"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import BookDesk from "./BookDesk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ImageMapper, { MapAreas } from "react-img-mapper";
import { cn } from "@/lib/utils";
import { Suspense, useState, useRef, useLayoutEffect } from "react";
import { getDesks } from "@/actions/actions";
import { Desk, DeskStatus } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import useDesks from "@/hooks/useDesks";
import useBook from "@/hooks/useBook";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "./Loading";
import moment from "moment";

import { toast } from "@/components/ui/use-toast";

type Prop = {
  floor: String | null;
  desks: Pick<Desk, "id" | "name" | "coordinates" | "status">[];
  image: string | null;
  date: Date | null;
};

function DeskMap({ floor, desks, image, date }: Prop) {
  const { selectedDesk, setSelectedDesk } = useDesks();
  const { setBook, setDate, handleBooking } = useBook();

  const [width, setWidth] = useState<number>(0);
  const ref = useRef(null);

  const list = [] as MapAreas[];

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
  }, []);

  desks.forEach((item, index) => {
    list[index] = {
      id: item.id,
      coords: item.coordinates,
      shape: "rect",
      fillColor:
        item.status === DeskStatus.available ? "#e62012aa" : "#00ff194c",
    };
  });

  function book() {
    handleBooking();
    toast({
      title: "Booking",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          Your reservation has been created.
        </pre>
      ),
    });
  }

  // non-responsive image mapper
  // manual allocation of desks
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
              const idx = desks.findIndex((item) => e.id === item.id);
              setSelectedDesk(desks[idx]);
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
                <p>Starts {moment(date).fromNow()}</p>
                <p>Until: forever </p>
              </div>
              <Separator />
              <p className="py-4">
                This action cannot be undone. If you want to cancel your
                reservation, please go to the bookings page.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={book} variant="outline" className="text-sm">
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeskMap;
