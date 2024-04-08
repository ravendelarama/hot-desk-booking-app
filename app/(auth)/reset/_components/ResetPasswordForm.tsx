"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { resetPassword } from "@/actions/user";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

const formSchema = z
  .object({
    password: z
      .string()
      .min(10)
      .regex(
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/,
        {
          message:
            "Password must be eight characters including one uppercase letter, one special character and alphanumeric characters.",
        }
      ),
    confirmPassword: z.string().min(10),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: "Password did not match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const { toast } = useToast();
  const [seePass, setSeePass] = useState<boolean>(false);
  const [seeConfirmPass, setSeeConfirmPass] = useState<boolean>(false);
  const status = useFormStatus();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await resetPassword(token!, values.password!);
    console.log(values);
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Your new password must be different from previous used passwords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={seePass ? "text" : "password"}
                          placeholder="Enter your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant={null}
                          className="absolute right-1 top-0"
                          onClick={() => setSeePass(!seePass)}
                        >
                          <BiSolidShow
                            className={cn(
                              "h-5 w-5 scale-0 transition-all duration-200 ease-in-out absolute",
                              seePass && "scale-1"
                            )}
                          />
                          <BiSolidHide
                            className={cn(
                              "h-5 w-5 scale-1 absolute transition-all duration-200 ease-in-out",
                              seePass && "z-10 scale-0"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={seeConfirmPass ? "text" : "password"}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant={null}
                          className="absolute right-1 top-0"
                          onClick={() => setSeeConfirmPass(!seeConfirmPass)}
                        >
                          <BiSolidShow
                            className={cn(
                              "h-5 w-5 scale-0 transition-all duration-200 ease-in-out absolute",
                              seeConfirmPass && "scale-1"
                            )}
                          />
                          <BiSolidHide
                            className={cn(
                              "h-5 w-5 scale-1 absolute transition-all duration-200 ease-in-out",
                              seeConfirmPass && "z-10 scale-0"
                            )}
                          />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={status.pending}
              >
                Create new password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordForm;
