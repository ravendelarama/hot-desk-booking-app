"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import moment from "moment";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FormSchema = z.object({
  dob: z.date({
    required_error: "Invalid date.",
  }),
});

interface Prop {
  onSubmit(data: z.infer<typeof FormSchema>): Promise<void>;
  floor: string | null;
}

export function DatePicker({ onSubmit, floor }: Prop) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col justify-start w-full sm:flex-row sm:items-center gap-5"
      >
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Reservation date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full sm:w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      moment(date) < moment().subtract(1, "day") ||
                      moment(date) > moment().add(14, "days")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>See available desks for you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-full">
          <Button size="sm" className="w-full" type="submit" disabled={!floor}>
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
