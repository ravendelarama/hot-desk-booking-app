"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { cn } from "@/lib/utils";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useState } from "react";

const formSchema = z.object({
  oldPassword: z.string().min(8, {
    message: "Password is required.",
  }),
  newPassword: z
    .string()
    .min(10)
    .regex(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/,
      {
        message:
          "Password must be eight characters including one uppercase letter, one special character and alphanumeric characters.",
      }
    ),
});

export default function ChangePassModal() {
  const [oldPass, setOldPass] = useState(false);
  const [newPass, setNewPass] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className="p-5 border border-slate-400 shadow-sm rounded-lg flex items-center gap-6 lg:w-[40rem]">
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm font-semibold">Change Password</p>
        <p className="text-gray-300 text-xs">
          Changing your password will require you to enter your current password
          together with your new desired password.
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Change Password</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently change your
              account password.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={oldPass ? "text" : "password"}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant={null}
                          className="absolute right-1 top-0"
                          onClick={() => setOldPass(!oldPass)}
                        >
                          <BiSolidShow
                            className={cn(
                              "h-5 w-5 scale-0 transition-all duration-200 ease-in-out absolute",
                              oldPass && "scale-1"
                            )}
                          />
                          <BiSolidHide
                            className={cn(
                              "h-5 w-5 scale-1 absolute transition-all duration-200 ease-in-out",
                              oldPass && "z-10 scale-0"
                            )}
                          />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={newPass ? "text" : "password"}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant={null}
                          className="absolute right-1 top-0"
                          onClick={() => setNewPass(!newPass)}
                        >
                          <BiSolidShow
                            className={cn(
                              "h-5 w-5 scale-0 transition-all duration-200 ease-in-out absolute",
                              newPass && "scale-1"
                            )}
                          />
                          <BiSolidHide
                            className={cn(
                              "h-5 w-5 scale-1 absolute transition-all duration-200 ease-in-out",
                              newPass && "z-10 scale-0"
                            )}
                          />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create New Password</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
