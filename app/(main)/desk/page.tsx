"use client";

import { DeskPicker } from "@/components/DeskPicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { getDesks } from "@/actions/actions";

import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import DeskMap from "./_components/DeskMap";
import { Desk } from "@prisma/client";

const FormSchema = z.object({
  floor: z.string(),
  dob: z.date({
    required_error: "Invalid date.",
  }),
});

function Desk() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [floor, setFloor] = useState<String>();
  const [desks, setDesks] =
    useState<Pick<Desk, "id" | "name" | "coordinates" | "status">[]>();
  const [selectedDesk, setSelectedDesk] =
    useState<Pick<Desk, "id" | "name" | "coordinates" | "status">>();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await getDesks(data);
    setFloor(result[0].floor);
    setDesks(result[0].Desk);

    toast({
      description: <p>{JSON.stringify(result)}</p>,
    });
  }

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Desk map</h1>
      <DeskPicker form={form} onSubmit={onSubmit} />
      <DeskMap floor={floor} desks={desks} />
    </div>
  );
}

export default Desk;
