"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ChangePass() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
      <form>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="new-password"
          >
            Password
          </label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="New Password"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="current-password"
          >
            Current Password
          </label>
          <input
            type="password"
            id="current-password"
            name="current-password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Current Password"
          />
        </div>
        <div className="mb-4">
          <a href="#" className="text-black text-sm font-semibold">
            Can&apos;t remember your current password?{" "}
            <span className="text-blue-500 hover:text-blue-800 font-semibold">
              Reset your password.
            </span>
          </a>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-black text-white rounded-md"
          >
            Save password
          </button>
        </div>
      </form>
    </>
  );
}
