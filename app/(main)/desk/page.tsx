"use client";

import { DateTimePicker } from "@/components/DateTimePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { getAvailableDesks } from "@/actions/actions";

import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import DeskMap from "./_components/DeskMap";
import { DeskStatus } from "@prisma/client";

const FormSchema = z.object({
  dob: z.date({
    required_error: "Invalid date.",
  }),
});

function Desk() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await getAvailableDesks(data);

    toast({
      description: <p>{JSON.stringify(result)}</p>,
    });
  }

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Desk map</h1>
      <DateTimePicker
        label="Booking date"
        description="See available desks."
        form={form}
        onSubmit={onSubmit}
      />
      <DeskMap />
    </div>
  );
}

export default Desk;
