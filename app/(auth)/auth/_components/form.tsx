"use client";

import { verifyMFAToken } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import logoHeader from "@/public/text-dark.png";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

function VerifyForm({
  token,
  email,
  password,
}: {
  token: string;
  email: string;
  password: string;
}) {
  const router = useRouter();
  return (
    <div className="h-full">
      {token ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-auto h-auto border p-20 rounded-lg shadow-md flex flex-col items-center">
            <Image
              alt=""
              className="self-center"
              width={110}
              height={50}
              src={logoHeader}
            />
            <h1 className="text-3xl font-semibold mb-10">
              Multi Factor Authentication
            </h1>
            <p className="text-medium font-semibold mb-4">
              Welcome to SpotDesk!
            </p>
            <p className="text-medium font-semibold mb-8">
              To start your desk reservation, please verify your email address
              by clicking the button below.
            </p>
            <Button
              className="w-200 h-10 text-sm bg-black"
              onClick={async () => {
                const res = await verifyMFAToken(token! as string);

                if (res.email) {
                  const result = await signIn("credential-login", {
                    redirect: false,
                    emaiL: res?.email!,
                    password: res?.password!,
                  });
                  router.push("/");
                }

                toast({
                  // @ts-ignore
                  title: (
                    <p className="flex items-center gap-2">
                      Multi Factor Authentication
                    </p>
                  ),
                  description: res.message,
                });
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Authenticate
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <h1>Invalid Token</h1>
        </div>
      )}
    </div>
  );
}

export default VerifyForm;
