"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Floor } from "@prisma/client";

function OfficeArea({
  image,
  floor,
  onSelect,
}: {
  image: string;
  floor: {
    _count: {
      Desk: number;
    };
  } & Floor;
  onSelect: (area: { _count: { Desk: number } } & Floor) => Promise<void>;
}) {
  const imageUrl = `https://utfs.io/f/${image!}`;
  return (
    <>
      <Button
        variant={null}
        className="flex flex-col justify-center items-start w-full h-fit lg:w-64"
        onClick={async () => {
          await onSelect(floor);
        }}
      >
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <Image
              fill
              alt={floor.floor}
              src={imageUrl!}
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <p className="font-semibold">Office Area {floor.floor}</p>
        <p className="text-secondary text-xs">{floor._count.Desk!} desks</p>
      </Button>
    </>
  );
}

export default OfficeArea;
