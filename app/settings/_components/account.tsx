"use client";

import { useState } from "react";

export default function AccountSettings() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("************");

  const handleResetPassword = () => {
    alert("Reset Password Clicked");
  };

  const handleUploadPhoto = () => {
    // Implement your photo upload logic here
    alert("Photo uploaded");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      <div className="flex items-center space-x-8 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-4xl text-gray-500">JD</span>
          </div>
          <button
            onClick={handleUploadPhoto}
            className="px-2 py-1 bg-gray-200 text-black text-sm rounded-md"
          >
            Upload Profile Picture
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">General Info</h3>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              onClick={handleResetPassword}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
