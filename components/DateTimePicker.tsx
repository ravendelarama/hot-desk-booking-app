"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { UseFormReturn } from "react-hook-form";
import { useFormStatus } from "react-dom";

const FormSchema = z.object({
  dob: z.date({
    required_error: "Invalid date.",
  }),
});

interface Prop {
  label?: string;
  description?: string;
  form: UseFormReturn<{ dob: Date }, any, undefined>;
  onSubmit(data: z.infer<typeof FormSchema>): Promise<void>;
}

export function DateTimePicker({ label, description, form, onSubmit }: Prop) {
  const { pending } = useFormStatus();
  const currentDate = new Date();
  const prevDate = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    day: currentDate.getDate() - 1,
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col justify-start w-full sm:flex-row sm:items-center gap-3"
      >
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{label}</FormLabel>
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
                      date <
                      new Date(
                        prevDate.year,
                        prevDate.month,
                        prevDate.day,
                        prevDate.hours,
                        prevDate.minutes
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>{description}</FormDescription>
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
  );
}
