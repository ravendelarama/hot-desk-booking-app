"use client";

import { checkIfOccupied } from "@/actions/desk";
import { DeskStatus, Floor } from "@prisma/client";
import { useLayoutEffect, useRef, useState } from "react";

import ImageMapper from "react-img-mapper";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";

function CreateDeskMap({
  floorId,
  floor,
  image,
  onSelect,
}: {
  floorId: string;
  floor?: string;
  image: string;
  onSelect?: (x: string, y: string) => Promise<void>;
}) {
  const [width, setWidth] = useState<number>(0);
  const [height, setheight] = useState<number>(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
    window.addEventListener("resize", (event) => {
      event.preventDefault();

      // @ts-ignore
      setWidth(ref?.current?.offsetWidth);
      // @ts-ignore
      setheight(ref?.current?.offsetHeight);
    });
  }, []);

  return (
    <div ref={ref} className={cn("w-full border-red-500 border-0")}>
      <ImageMapper
        responsive={true}
        parentWidth={width!}
        src={image!}
        onImageClick={async (e) => {
          // @ts-ignore
          await onSelect(String(e.screenX), String(e.screenY));

          toast({
            description: `${e.clientX} ${e.clientY}`,
          });
        }}
        // onClick={async (e) => {
        //     // @ts-ignore
        //     await onSelect(String(e.coords[0]), String(e.coords[1]));

        //   toast({
        //     description: `${e.coords[0]} ${e.coords[1]}`,
        //   });
        // }}
        map={{
          name: "desk-map",
          areas: [],
          // areas: [
          //   {
          //     id: "1",
          //     shape: "circle",
          //     coords: [155, 100, 10],
          //     preFillColor: "#000000",
          //   },

          // ],
        }}
      />
    </div>
  );
}

export default CreateDeskMap;
