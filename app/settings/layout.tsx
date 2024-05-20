"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className=" w-64 border-r border-slate-800 py-6 px-4">
        <h2 className="text-xl font-semibold mb-4 text-primary">Settings</h2>
        <ul className="space-y-2">
          <li>
            <Button
              variant={null}
              className="w-full flex justify-start px-4 py-2 gap-3 transition-colors duration ease-in hover:bg-slate-100 hover:dark:bg-slate-900"
              asChild
            >
              <Link
                href={"/settings/account"}
                className="text-lg text-foreground"
              >
                Account
              </Link>
            </Button>
          </li>
          <li>
            <Button
              variant={null}
              className="w-full flex justify-start px-4 py-2 gap-3 transition-colors duration ease-in hover:bg-slate-100 hover:dark:bg-slate-900"
              asChild
            >
              <Link
                href={"/settings/notification"}
                className="text-lg text-foreground"
              >
                Notifications
              </Link>
            </Button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-7">
        <div className="ml-10 mr-52">{children}</div>
      </div>
    </div>
  );
}
