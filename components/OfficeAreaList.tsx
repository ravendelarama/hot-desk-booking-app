import { getFloors } from "@/actions/floor";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import OfficeArea from "./OfficeArea";
import { Floor } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import useFloors from "@/hooks/useFloors";

function OfficeAreaList({
  onSelect,
}: {
  onSelect: (area: { _count: { Desk: number } } & Floor) => Promise<void>;
}) {
  const { floors } = useFloors();

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-start items-center">
      {
        // @ts-ignore
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
      }
    </div>
  );
}

export default OfficeAreaList;
