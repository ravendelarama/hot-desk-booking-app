"use client";

import React from "react";
import { BsJournalBookmarkFill } from "react-icons/bs";

export default function UserDashboard() {
  const multiFactorClass =
    "flex flex-col items-start justify-start text-black border rounded-lg border-gray-300 relative p-6 cursor-pointer w-[400px] h-auto";

  const handleIconClick = () => {
    console.log("Icon clicked");
  };

  const handleSeeAllClick = () => {
    console.log("See all clicked");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Home</h1>
      <div className="flex mb-0 space-x-6">
        <div
          className={
            "flex flex-col items-start justify-center text-black border rounded-lg relative p-6 cursor-pointer w-[300px] h-[150px] border-gray"
          }
        >
          <button
            className="absolute top-8 right-4 cursor-pointer"
            onClick={handleIconClick}
          >
            <BsJournalBookmarkFill />
          </button>
          <span className="font-semibold text-lg">Upcoming reservations</span>
          <div className="mr-2 mt-2">
            <p className="text-3xl font-bold ml-4 p-2">+2</p>
            <p className="whitespace-nowrap">
              desk reservations scheduled today.
            </p>
          </div>
        </div>
        <div
          className={
            "flex flex-col items-start justify-center text-black border rounded-lg relative p-6 cursor-pointer w-[300px] h-[150px] border-gray"
          }
        >
          <button
            className="absolute top-8 right-4 cursor-pointer"
            onClick={handleIconClick}
          >
            <BsJournalBookmarkFill />
          </button>
          <span className="font-semibold text-lg">Your bookings</span>
          <div className="mr-2 mt-2">
            <p className="text-3xl font-bold ml-4 p-2">+5</p>
            <p className="whitespace-nowrap">
              total amount of desk reservations.
            </p>
          </div>
        </div>
        <div className={multiFactorClass}>
          <span className="font-semibold text-lg">
            Enable Multi-factor Authentication
          </span>
          <div className="mt-2">
            <p className="whitespace-nowrap text-gray-500">
              Keep your SpotDesk account secure by enabling...
            </p>
          </div>
          <span className="font-semibold text-lg mt-4">
            Enable Email Notifications
          </span>
          <div className="mt-2">
            <p className="whitespace-nowrap text-gray-500">
              Enable email reservation reminders in the settings.
            </p>
          </div>
          <div className="mt-4">
            <span className="font-semibold text-lg">Booking reminders</span>
            <ul className="mt-2">
              <li className="flex items-center mb-5">
                <button className="flex items-center" onClick={handleIconClick}>
                  <BsJournalBookmarkFill className="mr-2" />
                  <span>Today, Desk A3 in Office Area 2</span>
                </button>
              </li>
              <li className="flex items-center mb-5">
                <button className="flex items-center" onClick={handleIconClick}>
                  <BsJournalBookmarkFill className="mr-2" />
                  <span>Today, Desk A3 in Office Area 2</span>
                </button>
              </li>
              <li className="flex items-center mb-5">
                <button className="flex items-center" onClick={handleIconClick}>
                  <BsJournalBookmarkFill className="mr-2" />
                  <span>June 05, Desk C1 in Office Area C</span>
                </button>
              </li>
              <li className="flex items-center mb-5">
                <button className="flex items-center" onClick={handleIconClick}>
                  <BsJournalBookmarkFill className="mr-2" />
                  <span>June 05, Desk C1 in Office Area C</span>
                </button>
              </li>
            </ul>

            <button
              className="text-gray-500 underline mt-2"
              onClick={handleSeeAllClick}
            >
              see all...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
