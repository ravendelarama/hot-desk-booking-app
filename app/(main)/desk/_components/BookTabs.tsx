"use client";

import { Desk, DeskStatus, Floor } from "@prisma/client";
import moment from "moment";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IoMdAdd } from "react-icons/io";
import { PiOfficeChair } from "react-icons/pi";
import { GrMap } from "react-icons/gr";
import { cn } from "@/lib/utils";
import OfficeAreaList from "@/components/OfficeAreaList";
import { Input } from "@/components/ui/input";
import WorkspaceMap from "@/components/WorkspaceMap";
import DeskInfo from "./DeskInfo";
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

import { TimestampPicker } from "@/components/DateFilter";
import { getDeskById } from "@/actions/desk";
import { toast } from "@/components/ui/use-toast";
import { addBooking } from "@/actions/booking";

function BookTabs() {
  const [workspace, setWorkspace] = useState<null | Floor>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDesk, setSelectedDesk] = useState<
    | (Desk & {
        Booking: {
          user: {
            firstName: string;
            lastName: string;
            email: string | null;
            image: string | null;
          };
          startedAt: Date;
          bookedAt: Date;
        }[];
      })
    | null
  >(null);

  async function onSelect(area: { _count: { Desk: number } } & Floor) {
    // soon be officeArea
    if (!area) {
      setWorkspace(null);
    } else {
      // @ts-ignore
      setWorkspace(area!);
    }
  }

  async function onSelectDesk(id: string) {
    if (selectedDesk?.id! != id) {
      const data = await getDeskById(id, date);

      setSelectedDesk(data);

      toast({
        title: "Selected Desk",
        description: `DeskId: ${id}`,
      });
    }
  }

  return (
    <>
      <Tabs defaultValue="areas" className="w-full">
        <div className="w-full flex flex-col lg:flex-row md:justify-between items-center gap-2 md:gap-0">
          <h1 className="text-left text-3xl font-bold font-sans w-fit shrink-0">
            Desk map
          </h1>
          <TabsList className="flex justify-start gap-2 w-full md:w-fit">
            <TabsTrigger
              value="areas"
              className={cn("w-full md:w-fit flex items-center gap-2")}
            >
              <GrMap className="hidden h-5 w-5 md:block" />
              Workspace
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="w-full md:w-fit flex items-center gap-2"
            >
              <PiOfficeChair className="hidden h-5 w-5 md:block" />
              Desk
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="areas" className="mt-4 space-y-2">
          <Input className="w-full lg:w-72" placeholder="Search an area" />
          <OfficeAreaList onSelect={onSelect} />
        </TabsContent>
        <TabsContent value="map" className="w-full mt-10 border rounded-lg">
          {/*  */}
          <div className="flex justify-between border-b w-full p-4">
            <TimestampPicker date={date} setDate={(date) => setDate(date)} />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-1">
                  <IoMdAdd className="h-5 w-5" />
                  Create booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {moment(selectedDesk?.Booking[0]?.startedAt)
                      .date()
                      .toLocaleString() == moment(date).date().toLocaleString()
                      ? "Desk has been reserved"
                      : "Confirm your reservation"}
                  </DialogTitle>
                  <DialogDescription>
                    {moment(selectedDesk?.Booking[0]?.startedAt)
                      .date()
                      .toLocaleString() == moment(date).date().toLocaleString()
                      ? `Sorry, this desk has been reserved to ${selectedDesk?.Booking[0]?.user?.firstName} ${selectedDesk?.Booking[0]?.user?.lastName}.`
                      : "This action cannot be undone. This will be saved into the system."}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant={
                      moment(selectedDesk?.Booking[0]?.startedAt)
                        .date()
                        .toLocaleString() ==
                      moment(date).date().toLocaleString()
                        ? "secondary"
                        : "success"
                    }
                    // @ts-ignore
                    disabled={
                      moment(selectedDesk?.Booking[0]?.startedAt)
                        .date()
                        .toLocaleString() ==
                      moment(date).date().toLocaleString()
                    } // to be fix
                    onClick={async () => {
                      if (selectedDesk) {
                        await addBooking(
                          {
                            id: selectedDesk?.id!,
                            floorId: selectedDesk?.floorId!,
                            name: selectedDesk?.name!,
                            coordinates: selectedDesk?.coordinates!,
                            amenities: selectedDesk?.amenities!,
                            status: selectedDesk?.status!,
                            createdAt: selectedDesk?.createdAt!,
                            updatedAt: selectedDesk?.updatedAt!,
                          },
                          date
                        );

                        toast({
                          title: "Reservation Successful!",
                          description: `${selectedDesk?.name} has been booked!`,
                        });
                      }
                    }}
                  >
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full p-4 flex flex-col justify-center md:flex-row md:justify-between gap-2">
            {workspace && workspace.image && (
              <WorkspaceMap
                floorId={workspace?.id!}
                image={`https://utfs.io/f/${workspace.image!}`}
                onSelect={onSelectDesk}
                date={date}
              />
            )}
            {!!selectedDesk && (
              <DeskInfo
                name={selectedDesk.name!}
                status={selectedDesk?.status!}
                area={workspace?.floor!}
                booking={selectedDesk.Booking!}
                amenities={selectedDesk.amenities}
                startedAt={date}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default BookTabs;
