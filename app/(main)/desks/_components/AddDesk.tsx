"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DesksFormSchema } from "./UpdateRow";
import { Input } from "@/components/ui/input";
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
import { addDesk } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@/components/ui/dialog";
import useFloors from "@/hooks/useFloors";

export const NewDeskSchema = z.object({
  floor: z.string(),
  name: z.string(),
  coord1: z.string(),
  coord2: z.string(),
  coord3: z.string(),
});

function AddDesk() {
  const { floors } = useFloors();

  const form = useForm<z.infer<typeof NewDeskSchema>>({
    resolver: zodResolver(NewDeskSchema),
    defaultValues: {
      floor: "",
      name: "",
      coord1: "",
      coord2: "",
      coord3: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof NewDeskSchema>) {
    const response = await addDesk(
      values.floor,
      values.name,
      values.coord1,
      values.coord2,
      values.coord3
    );
    toast({
      title: "Created Desk",
      description: "Desk created successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="floor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose Floor</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Floors</SelectLabel>
                      {floors.map((item) => (
                        <SelectItem key={item.id!} value={item.id!}>
                          {item.floor}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desk Name</FormLabel>
              <FormControl>
                <Input placeholder="D#" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-around items-center gap-4">
          <FormField
            control={form.control}
            name="coord1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>x</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coord2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>y</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coord3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>scale</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-end gap-5 item-center">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"success"} type="submit">
              Create
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

export default AddDesk;
