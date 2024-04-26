"use client";

import { checkIfOccupied } from "@/actions/desk";
import { DeskStatus, Floor } from "@prisma/client";
import { useLayoutEffect, useRef, useState } from "react";

import ImageMapper, { MapAreas } from "react-img-mapper";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import useDesks from "@/hooks/useDesks";

function WorkspaceMap({
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
  const ref = useRef(null);
  const { desks: data } = useDesks({ floorId });

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
    window.addEventListener("resize", (event) => {
      event.preventDefault();

      // @ts-ignore
      setWidth(ref?.current?.offsetWidth);
    });
  }, []);

  function hydrateDesks() {
    // @ts-ignore
    const list: MapAreas[] = [];

    if (data) {
      data?.Desk?.forEach((item) => {
        const isOccupied = async () =>
          await checkIfOccupied(item.id, new Date()); // to be search by date

        list.push({
          id: String(item.id),
          coords: [item.coordinates[0], item.coordinates[1], 10],
          shape: "circle",
          preFillColor:
            item.status === "available"
              ? "#00ff194c"
              : !!isOccupied
              ? "#FFA349dd"
              : "#e62012aa", //
        });
      });
    }
    return list;
  }

  return (
    <div ref={ref} className={cn("w-full border-red-500 border")}>
      <ImageMapper
        responsive={true}
        parentWidth={width!}
        src={image!}
        onImageClick={async (e) => {
          // @ts-ignore
          await onSelect(String(e.clientX), String(e.clientY));

          toast({
            description: `${e.clientX} ${e.clientY}`,
          });
        }}
        onClick={async (e) => {
          // @ts-ignore
          await onSelect(String(e.coords[0]), String(e.coords[1]));

          toast({
            description: `${e.coords[0]} ${e.coords[1]}`,
          });
        }}
        map={{
          name: "desk-map",
          areas: hydrateDesks(),
        }}
      />
    </div>
  );
}

export default WorkspaceMap;
