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
import { mutateUser } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string().default("user"),
  isBanned: z.boolean().default(false),
});

function UpdateRow({ data }: { data: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      role: data?.role,
      isBanned: data?.isBanned,
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await mutateUser(data.id, values);

    toast({
      title: "Mutated User",
      description: "User updated successfully.",
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-1">
                <FormLabel>Promote user</FormLabel>
                <FormDescription>
                  This user will be able to access permissions according to
                  their assigned role.
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Office Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
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
          name="isBanned"
          render={({ field }) => (
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormItem className="flex justify-between item-center w-full">
                <div>
                  <FormLabel>Ban user</FormLabel>
                  <FormDescription>
                    This user will not be able to log in until they are given
                    permission by the administrator.
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
            </div>
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
