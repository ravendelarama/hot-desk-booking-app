"use client";

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

import { TimestampPicker } from "@/components/DateFilter";

function BookTabs() {
  return (
    <>
      <Tabs defaultValue="areas" className="w-full">
        <div className="flex flex-col lg:flex-row md:justify-between items-center gap-2 md:gap-0">
          <h1 className="text-left text-3xl font-bold font-sans w-fit shrink-0">
            Desk map
          </h1>
          <TabsList className="flex justify-start gap-2 w-full md:w-fit">
            <TabsTrigger
              value="areas"
              className={cn("w-full md:w-fit flex items-center gap-2")}
            >
              <GrMap className="hidden h-5 w-5 md:block" />
              Office Area
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="w-full md:w-fit flex items-center gap-2"
            >
              <PiOfficeChair className="hidden h-5 w-5 md:block" />
              Workspace
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="areas" className="mt-4 space-y-2">
          <Input className="w-full lg:w-72" placeholder="Search an area" />
          <OfficeAreaList />
        </TabsContent>
        <TabsContent value="map" className="mt-10 border rounded-lg">
          {/*  */}
          <div className="flex justify-between border-b w-full p-4">
            <TimestampPicker />{" "}
            <Button className="flex gap-1">
              <IoMdAdd className="h-5 w-5" />
              Create booking
            </Button>
          </div>
          <div className="p-4 flex flex-col justify-center md:flex-row md:justify-start gap-2">
            <WorkspaceMap />
            <DeskInfo />
          </div>
          {/*  */}
        </TabsContent>
      </Tabs>
    </>
  );
}

export default BookTabs;
