"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";

function OfficeArea() {
  return (
    <>
      <Button
        variant={null}
        className="flex flex-col justify-center items-start w-full h-fit lg:w-64"
      >
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <Image
              fill
              alt="Area"
              src="https://utfs.io/f/c997ef4c-61f8-4e66-b3b2-7e0d218545f3-cb3i5r.jpg"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <p className="font-semibold">Office Area A1</p>
        <p className="text-secondary text-xs">15 desks</p>
      </Button>
    </>
  );
}

export default OfficeArea;
