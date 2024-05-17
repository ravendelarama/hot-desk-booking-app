import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { mutateBooking } from "@/actions/booking";

import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

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
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  reminders: z.boolean(),
});

function UpdateRow({ data }: { data: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reminders: data?.notifyReminders,
    },
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateBooking(data?.id, values.reminders);

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
          name="reminders"
          render={({ field }) => (
            <FormItem className="p-3 rounded-lg border flex flex-row items-center justify-between shadow-sm">
              <div className="space-y- 5">
                <FormLabel>Reservation Reminders</FormLabel>
                <FormDescription>
                  Receive emails about your desk reservations.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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
