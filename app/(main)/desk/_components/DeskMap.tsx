import { Desk, DeskStatus } from "@prisma/client";
import ImageMapper, { MapAreas } from "react-img-mapper";
import moment from "moment";

import { Suspense, useState, useRef, useLayoutEffect } from "react";
import useDesks from "@/hooks/useDesks";
import useBook from "@/hooks/useBook";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import Loading from "./Loading";
import { Separator } from "@/components/ui/separator";

type Prop = {
  floor: String | null;
  desks: Pick<Desk, "id" | "name" | "coordinates" | "status">[];
  image: string | null;
  date: Date | null;
};

function DeskMap({ floor, desks, image, date }: Prop) {
  const { selectedDesk, setSelectedDesk } = useDesks();
  const { setBook, setDate, handleBooking } = useBook();
  const [width, setWidth] = useState<number>(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    // @ts-ignore
    setWidth(ref?.current?.offsetWidth);
    window.addEventListener("resize", (event) => {
      event.preventDefault();

      // @ts-ignore
      setWidth(ref?.current?.offsetWidth);
    });
  }, []);

  const list: MapAreas[] = [];

  desks.forEach((item, index) => {
    list[index] = {
      id: item.id,
      coords: item.coordinates,
      shape: "circle",
      preFillColor:
        item.status === DeskStatus.available ? "#00ff194c" : "#e62012aa",
      lineWidth: 3,
      strokeColor: "#000000",
      fillColor: item.status === DeskStatus.available ? "#179920" : "#991f37",
    };
  });

  function book() {
    handleBooking();
    toast({
      title: "Booking",
      description: (
        <p className="text-sm">Your reservation has been created.</p>
      ),
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm font-semibold">
          {!selectedDesk
            ? "Please select your desired desk."
            : selectedDesk.status === DeskStatus.available
            ? `You have selected desk ${selectedDesk.name} on floor ${floor}.`
            : `Desk ${selectedDesk.name} is unavailable.`}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-sm w-16 px-2"
              disabled={!floor || !date || !selectedDesk}
              onClick={() => {
                setBook(selectedDesk!);
                setDate(date!);
              }}
            >
              Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col gap-2 py-4">
                  <p>Desk Name: {selectedDesk?.name}</p>
                  <p>Status: {selectedDesk?.status}</p>
                  <p>
                    {moment(date) > moment() ? "Starts" : "Started"}{" "}
                    {moment(date).fromNow()}
                  </p>
                  <p>
                    {moment(date) < moment() ? "Ends" : "Ended"}{" "}
                    {moment(date).add(1, "day").fromNow()}{" "}
                  </p>
                </div>
                <Separator />
                <p className="py-4">
                  This action cannot be undone. If you want to cancel your
                  reservation, please go to the bookings page.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"} className="text-sm">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={book}
                  variant="success"
                  className="text-sm"
                  disabled={selectedDesk?.status == "unavailable"}
                >
                  Continue
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div ref={ref} className="w-full border rounded-md overflow-auto">
        <Suspense fallback={<Loading />}>
          {image ? (
            <ImageMapper
              responsive={true}
              parentWidth={width!}
              natural={true}
              src={image!}
              onImageClick={() => {
                setSelectedDesk(null);
              }}
              onClick={(e) => {
                const idx = desks.findIndex((item, i) => {
                  // finds the clicked desk
                  if (e.id === item.id) {
                    return true;
                  }
                });
                setSelectedDesk(desks[idx]);
              }}
              map={{
                name: "desk-map",
                areas: list,
              }}
            />
          ) : (
            <p className="p-10 text-slate-500 text-center font-bold">
              Please select a floor.
            </p>
          )}
        </Suspense>
      </div>
    </>
  );
}

export default DeskMap;
