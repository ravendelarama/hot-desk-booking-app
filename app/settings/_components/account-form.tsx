"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
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
import { updateName } from "@/actions/user";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  firstName: z.string().min(3, {
    message: "First name is required.",
  }),
  lastName: z.string().min(3, {
    message: "Last name is required.",
  }),
});

export default function AccountSettings() {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: session?.user?.firstName,
      lastName: session?.user?.lastName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateName(values.firstName, values.lastName);
    alert("Name has been updated!");
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-start items-center gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-end">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
