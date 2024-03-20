"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Form from "../../_components/SignUpForm";
import { Separator } from "@/components/ui/separator";

function SignUp() {
  const [image] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-5 flex justify-center items-center">
      <Card className="sm:py-4 sm:px-2">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Sign up with your firstname, lastname, email and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form image={image!} />
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Separator />
          <div className="w-full flex flex-col justify-center items-center space-y-4">
            <Button
              variant="outline"
              onClick={() => {
                signIn("google");
              }}
              className="w-full"
            >
              Sign up with Google
            </Button>
            <p className="text-xs text-slate-500">
              By creating an account, you agree to our{" "}
              <Link
                href="https://www.termsandconditionsgenerator.com/live.php?token=PdpUwBeiWejWjoz8FkuTNxFBvoQkiTGM"
                className="inline font-semibold"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="https://www.termsfeed.com/live/692e4cf6-fab6-4248-b2d1-f70df161dd08"
                className="inline font-semibold"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
