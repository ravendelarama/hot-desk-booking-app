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

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { mutateDesk } from "@/actions/desk";
import { useToast } from "@/components/ui/use-toast";
import { DeskStatus } from "@prisma/client";

export const DesksFormSchema = z.object({
  name: z.string(),
  coord1: z.string(),
  coord2: z.string(),
  coord3: z.string(),
  status: z.string(),
});

function UpdateRow({
  data,
}: {
  data: {
    id: string;
    name: string;
    coordinates: string[];
    status: DeskStatus;
  };
}) {
  const form = useForm<z.infer<typeof DesksFormSchema>>({
    resolver: zodResolver(DesksFormSchema),
    defaultValues: {
      name: data?.name,
      coord1: data?.coordinates[0].toString(),
      coord2: data?.coordinates[1].toString(),
      coord3: data?.coordinates[2].toString(),
      status: data?.status,
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof DesksFormSchema>) {
    console.log(values.coord1);
    await mutateDesk(
      data?.id!,
      values.name,
      Number(values.coord1),
      Number(values.coord2),
      Number(values.coord3),
      values.status as DeskStatus
    );

    toast({
      title: "Updated Desk",
      description: "Desk updated successfully.",
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desk Name</FormLabel>
              <FormControl>
                <Input placeholder="Desk" {...field} />
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
                  <Input placeholder="0" {...field} />
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
                  <Input placeholder="0" {...field} />
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
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-1">
                <FormLabel>Desk Status</FormLabel>
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
                      <SelectLabel>Desk Status</SelectLabel>
                      <SelectItem value={DeskStatus.available}>
                        Available
                      </SelectItem>
                      <SelectItem value={DeskStatus.unavailable}>
                        Unavailable
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
