"use client";

import { checkIfOccupied } from "@/actions/desk";
import { DeskStatus, Floor } from "@prisma/client";
import { useLayoutEffect, useRef, useState } from "react";

import ImageMapper from "react-img-mapper";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getFloorImage } from "@/actions/floor";

function CreateDeskMap({
  floorId,
  floor,
  onSelect,
}: {
  floorId: string;
  floor?: string;
  onSelect?: (x: string, y: string) => Promise<void>;
}) {
  const {
    data: image,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["floors", "image"],
    queryFn: async () => {
      // @ts-ignore
      const image = await getFloorImage(floorId);
      return `https://utfs.io/f/${image!}`;
    },
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
  });

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
    window.addEventListener("resize", (event) => {
      event.preventDefault();

      // @ts-ignore
      setWidth(ref?.current?.offsetWidth);

      // @ts-ignore
      setHeight(ref?.current?.offsetHeight);
    });
  }, []);

  console.log(image);
  return (
    <div ref={ref} className={cn("w-full border-red-500 border-0")}>
      {isFetched || !isFetching ? (
        <ImageMapper
          responsive
          parentWidth={width!}
          src={image!}
          natural={true}
          onImageClick={async (e) => {
            // @ts-ignore
            await onSelect(String(e.screenX), String(e.screenY));
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
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default CreateDeskMap;
