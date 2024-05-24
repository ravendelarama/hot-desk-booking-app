import { getFloors } from "@/actions/floor";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import OfficeArea from "./OfficeArea";
import { Floor } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import useFloors from "@/hooks/useFloors";
import { useState } from "react";
import { cn } from "@/lib/utils";

function OfficeAreaList({
  onSelect,
  query,
}: {
  onSelect: (area: { _count: { Desk: number } } & Floor) => Promise<void>;
  query: string;
}) {
  const { floors, isFetching } = useFloors(query);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:flex-wrap items-center justify-center",
        floors && floors?.length > 0 && "justify-start"
      )}
    >
      {isFetching ? (
        "Loading..." // @ts-ignore
      ) : floors.length > 0 ? (
        floors?.map((item) => {
          return (
            <OfficeArea
              key={item.id!}
              floor={item!}
              onSelect={onSelect}
              image={item.image!}
            />
          );
        })
      ) : (
        <p>Sorry, Workspace {query} doesn&apos;t exists.</p>
      )}
    </div>
  );
}

export default OfficeAreaList;
