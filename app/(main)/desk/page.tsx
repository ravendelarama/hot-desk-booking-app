"use client";

import { DeskPicker } from "@/components/DeskPicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { getDesks } from "@/actions/actions";

import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useState, Suspense } from "react";
import DeskMap from "./_components/DeskMap";
import useDesks from "@/hooks/useDesks";
import useFloors from "@/hooks/useFloors";

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

  const { desks, setDesks } = useDesks();
  const [date, setDate] = useState<Date | null>(null);

  const { activeFloor, setActiveFloor, activeImage } = useFloors();

  async function onSubmitDeskPicker(data: z.infer<typeof FormSchema>) {
    const result = await getDesks(data);
    setActiveFloor(result?.floor!, result?.image!);
    setDesks(result?.Desk!, result?.floor!);
    setDate(data.dob);

    // toast({
    //   title: `Floor: ${activeFloor}`,
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(desks, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">Desk map</h1>
      <DeskPicker form={form} onSubmit={onSubmitDeskPicker} />
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
