"use client";

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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { UploadDropzone } from "@/utils/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";

function SignUp() {
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);

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
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={async (res) => {
              // Do something with the response
              setImage(res[0].url);

              toast({
                title: "User Profile",
                description: (
                  <p>
                    Image Uploaded,{" "}
                    <Link href={res[0].url} target="_">
                      click here!
                    </Link>
                  </p>
                ),
              });
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            className="p-10 border-none hover:border-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
          />
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
