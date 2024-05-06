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
  date,
}: {
  floorId: string;
  floor?: string;
  image: string;
  onSelect?: (id: string) => Promise<void>;
  date: Date;
}) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const ref = useRef(null);
  const { desks: data } = useDesks({ floorId });

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
    window.addEventListener("resize", (event) => {
      event.preventDefault();

      // @ts-ignore
      setWidth(ref?.current?.offsetWidth);

      // @ts-ignore
      setWidth(ref?.current?.offsetHeight);
      console.log(data);
    });
  }, []);

  function hydrateDesks() {
    // @ts-ignore
    const list: MapAreas[] = [];

    if (data) {
      for (let idx = 0; idx < data?.Desk.length; idx++) {
        var i = data?.Desk[idx];
        // const isOccupied = async () => await checkIfOccupied(i.id!, new Date()); // to be search by date
        // var val = false;

        // isOccupied().then((result) => {
        //   val = result;
        // });

        list.push({
          id: String(i?.id),
          coords: [i?.coordinates[0]! - 420, i?.coordinates[1]! - 290, 10],
          shape: "circle",
          preFillColor:
            i?.status! === "available"
              ? i?.Booking.includes({ bookedAt: date })
                ? "#ed6e07"
                : "#338c17"
              : "#c61d1d",
        });
      }
    }

    console.log(list);
    return list;
  }

  return (
    <div ref={ref} className={cn("w-full lg:w-[60%]")}>
      <ImageMapper
        responsive={true}
        parentWidth={width!}
        src={image!}
        onImageClick={async (e) => {}}
        onClick={async (e) => {
          // @ts-ignore
          await onSelect(e.id);
        }}
        map={{
          name: "workspace-map",
          areas: hydrateDesks(),
        }}
      />
    </div>
  );
}

export default WorkspaceMap;
