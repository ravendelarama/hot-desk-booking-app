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
import { useState } from "react";
import { getDesks } from "@/actions/actions";
import { Desk } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import useDesks from "@/hooks/useDesks";
import useBook from "@/hooks/useBook";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Prop = {
  floor: String | null;
  desks: Pick<Desk, "id" | "name" | "coordinates" | "status">[];
  image: string | null;
  date: Date | null;
};

function DeskMap({ floor, desks, image, date }: Prop) {
  const { selectedDesk, setSelectedDesk } = useDesks();
  const { setBook, setDate, handleBooking } = useBook();

  const list = [] as MapAreas[];

  desks.forEach((item, index) => {
    list[index] = {
      id: item.id,
      coords: item.coordinates,
      shape: "rect",
      fillColor: "#00ff194c",
    };
  });

  function book() {
    handleBooking();
  }

  // non-responsive image mapper
  // manual allocation of desks
  // dialog to be modified
  return (
    <>
      <h1>{selectedDesk && selectedDesk.name}</h1>
      <ScrollArea>
        <ImageMapper
          height={500}
          width={600}
          imgWidth={600}
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
      </ScrollArea>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-sm w-16 px-2"
            disabled={!selectedDesk && !date && !floor}
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
              This action cannot be undone. If you want to cancel your
              reservation, please go to the bookings page.
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
