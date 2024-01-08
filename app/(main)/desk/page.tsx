"use client";

import { DatePicker } from "@/components/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { useFormStatus } from "react-dom";
import { getDesks } from "@/actions/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, Suspense } from "react";
import DeskMap from "./_components/DeskMap";
import useDesks from "@/hooks/useDesks";
import useFloors from "@/hooks/useFloors";
import { Skeleton } from "@/components/ui/skeleton";
// import TimeStampPicker from "@/components/TimeStampPicker";

const FloorSchema = z.object({
  floor: z.string(),
});

const DateSchema = z.object({
  dob: z.date(),
});

function Desk() {
  const form = useForm<z.infer<typeof FloorSchema>>({
    resolver: zodResolver(FloorSchema),
  });

  const { desks, setDesks } = useDesks();

  const { activeFloor, setActiveFloor, activeImage, floors } = useFloors();
  const { pending } = useFormStatus();

  const [date, setDate] = useState<Date>(new Date());
  // const [timeRange, setTimeRange] = useState<Date[]>(["00:00:00", "00:00:00"]);

  async function onSubmitFloorPicker(data: z.infer<typeof FloorSchema>) {
    const result = await getDesks(data);
    setActiveFloor(result?.floor!, result?.image!);
    setDesks(result?.Desk!, result?.floor!);
  }

  async function onSubmitDatePicker(data: z.infer<typeof DateSchema>) {
    setDate(data.dob);
  }

  function onChange() {}

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5 w-full">
      <h1 className="text-3xl font-bold font-sans">Desk map</h1>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitFloorPicker)}
            className="relative flex flex-col justify-start w-full sm:flex-row sm:items-center gap-5"
          >
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Floor</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="sm:w-[180px] w-full pl-3 text-left font-normal">
                        <SelectValue placeholder="Select a floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {floors &&
                        floors.map((item, index) => (
                          <Suspense
                            key={index}
                            fallback={
                              <Skeleton className="h-8 w-full rounded-sm" />
                            }
                          >
                            <SelectItem value={item.floor}>
                              {item.floor}
                            </SelectItem>
                          </Suspense>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a floor for your reservation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-full">
              <Button
                size="sm"
                className="w-full"
                type="submit"
                aria-disabled={pending}
              >
                Show
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <DatePicker onSubmit={onSubmitDatePicker} floor={activeFloor} />
      <DeskMap
        desks={desks}
        floor={activeFloor}
        image={activeImage}
        date={date}
      />
    </div>
  );
}

export default Desk;
