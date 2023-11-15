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

import ImageMapper from "react-img-mapper";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { getAvailableDesks } from "@/actions/actions";
import { Separator } from "@/components/ui/separator";

interface Prop {
  bookings: any;
}

function DeskMap() {
  const [dialog, setDialog] = useState<boolean>(false);
  const [deskHover, setDeskHover] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>
            <div className="flex justify-start items-center gap-10 pb-3">
              <p className="font-bold">Desk Status:</p>
              <p className="flex gap-3 items-center">
                <span className="font-semibold text-xs">Available</span>
                <span className="inline-block h-3 w-3 rounded-full bg-green-700"></span>
              </p>
              <p className="flex gap-3 items-center">
                <span className="font-semibold text-xs">Occupied</span>
                <span className="inline-block h-3 w-3 rounded-full bg-cyan-700"></span>
              </p>
              <p className="flex gap-3 items-center">
                <span className="font-semibold text-xs">Disabled</span>
                <span className="inline-block h-3 w-3 rounded-full bg-slate-700"></span>
              </p>
            </div>
            {/* <Separator orientation="horizontal" /> */}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-start items-center">
          {/* <BookDesk /> */}
          <ImageMapper
            src="https://raw.githubusercontent.com/img-mapper/react-docs/master/src/assets/example.jpg"
            onClick={(e) => {
              setDialog(true);
              setId(e.id!);
              setDeskHover(false);
            }}
            onMouseEnter={(e) => {
              setId(e.id!);
              setDeskHover(true);
            }}
            onMouseLeave={(e) => {
              setId("");
              setDeskHover(false);
            }}
            
            map={{
              name: "desk-map",
              areas: [
                {
                  id: "2",
                  shape: "rect",
                  coords: [37, 37, 126, 104],
                  preFillColor: "transparent",
                  fillColor: "#22222f",
                  strokeColor: "transparent",
                },
                {
                  id: "3",
                  shape: "rect",
                  coords: [131, 39, 215, 107],
                  preFillColor: "transparent",
                  fillColor: "#22222f",
                  strokeColor: "transparent",
                },
              ],
            }}
          />
          <div
            className={cn(
              "hidden border border-slate-800 z-10 absolute top-[37] left-[40] text-white bg-slate-100 dark:bg-slate-950 rounded-lg p-10",
              deskHover && "block"
            )}
          >
            {id}
          </div>
        </CardContent>
        <CardFooter>
          <div
            className={cn(
              "hidden border border-slate-800 z-10 absolute top-[37] left-[40] text-white bg-slate-100 dark:bg-slate-950 rounded-lg p-10",
              dialog && "block"
            )}
          >
            k
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default DeskMap;
