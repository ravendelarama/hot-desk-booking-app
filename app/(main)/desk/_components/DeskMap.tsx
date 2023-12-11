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
import { getDesks } from "@/actions/actions";
import { Desk } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

type Prop = {
  floor?: String;
  desks?: Pick<Desk, "id" | "name" | "coordinates" | "status">[];
};

function DeskMap({ floor, desks }: Prop) {
  const [dialog, setDialog] = useState<boolean>(false);
  const [deskHover, setDeskHover] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  return (
    <>
      <ImageMapper
        height={500}
        width={500}
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
    </>
  );
}

export default DeskMap;
