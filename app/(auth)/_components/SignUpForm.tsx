"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { MdErrorOutline } from "react-icons/md";

const formSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
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

function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credential-register", {
      redirect: false,
      ...values,
    });

    if (res?.error) {
      toast({
        // @ts-ignore
        title: (
          <p className="flex items-center gap-2">
            <MdErrorOutline className="h-7 w-7" />
            {res?.error}
          </p>
        ),
        description: "Invalid Credentials",
        variant: "destructive",
      });
    }
  }

  const [seePass, setSeePass] = useState<boolean>(false);
  const [seeConfirmPass, setSeeConfirmPass] = useState<boolean>(false);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-4 items-center">
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
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={seePass ? "text" : "password"} {...field} />
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
                <FormDescription>Please confirm your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="inline font-semibold">
                Sign in
              </Link>
            </p>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SignUpForm;
