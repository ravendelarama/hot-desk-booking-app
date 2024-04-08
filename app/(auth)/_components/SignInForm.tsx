"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { MdErrorOutline } from "react-icons/md";
import { Mail } from "lucide-react";
import { redirect } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const [seePass, setSeePass] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credential-login", {
      redirect: false,
      ...values,
    });

    if (res?.error && res?.error == "Permission Denied") {
      // toast({
      //   // @ts-ignore
      //   title: (
      //     <p className="flex items-center gap-2">
      //       <MdErrorOutline className="h-7 w-7" />
      //       Permission Denied
      //     </p>
      //   ),
      //   description:
      //     "This account was forbidden from accessing the system. If you have any concerns please contact the administrator.",

      //   variant: "destructive",
      // });
      toast({
        // @ts-ignore
        title: (
          <p className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-foreground" />
            Verification email has been sent.
          </p>
        ),
        description: "verify your email.",
      });
    }

    if (res?.error) {
      toast({
        // @ts-ignore
        title: (
          <p className="flex items-center gap-2">
            <MdErrorOutline className="h-7 w-7" />
            Warning
          </p>
        ),
        description: res.error,
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe123@example.com" {...field} />
                </FormControl>
                <FormDescription>Please enter your email.</FormDescription>
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

                <FormDescription>Please enter your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="inline font-semibold">
                Sign up
              </Link>
            </p>
            <Button type="submit" className="text-xs sm:text-sm items-end">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SignInForm;
