"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { setReservationReminders } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { User } from "@prisma/client";

const formSchema = z.object({
  reminders: z.boolean(),
});

export default function ReminderNotification(user: User | null) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reminders: user?.notifyReminders,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await setReservationReminders(values.reminders);
    console.log(values);
  }

  return (
    <div className="lg:w-[40rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reminders"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-between items-center rounded-lg border p-5 shadow-sm">
                <div className="space-y-0 5">
                  <FormLabel>Reservation Reminders</FormLabel>

                  <FormDescription>
                    Enabling reservation reminders will keep you updated with
                    the current
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    type="submit"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
