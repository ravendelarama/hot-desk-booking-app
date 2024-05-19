"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-white w-1/4 border-r border-gray-300 p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <ul>
          <li className="text-black">
            <Button onClick={() => {}}>Account</Button>
          </li>
          <li className="text-black">
            <Button onClick={() => {}}>Notification</Button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-7">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
