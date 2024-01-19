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
import { DialogClose } from "@/components/ui/dialog";
import { mutateBooking } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { BookingStatus } from "@prisma/client";

const formSchema = z.object({
  status: z.string(),
});

function UpdateRow({ data }: { data: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: data?.status!,
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateBooking(data?.id, values.status);

    toast({
      title: "Booking Updated",
      description: "Booking updated successfully.",
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-1">
                <FormLabel>Change Status</FormLabel>
              </div>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value={BookingStatus.waiting}>
                        Pending
                      </SelectItem>
                      <SelectItem value={BookingStatus.checked_in}>
                        Check in
                      </SelectItem>
                      <SelectItem value={BookingStatus.checked_out}>
                        Check out
                      </SelectItem>
                      <SelectItem value={BookingStatus.no_show}>
                        No Show
                      </SelectItem>
                      <SelectItem value={BookingStatus.canceled}>
                        Cancel
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row justify-end gap-5 item-center">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"success"} type="submit">
              Save
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

export default UpdateRow;
