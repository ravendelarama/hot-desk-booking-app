"use client";

import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaTimes,
  FaCalendarCheck,
  FaClock,
  FaHistory,
  FaBan,
  FaRegCalendarAlt,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import moment from "moment";
import Image from "next/image";
import { cancelBooking } from "@/actions/booking";

export default function UserBookings({
  bookings,
}: {
  bookings: {
    id: string;
    desk: {
      name: string;
      Floor: {
        id: string;
        floor: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    };
    occuredAt: Date;
    bookedAt: Date;
    approved: boolean;
    canceled: boolean;
  }[];
}) {
  const [activeTab, setActiveTab] = useState("today");

  const renderContent = () => {
    switch (activeTab) {
      case "pending":
        return (
          <div className="border rounded p-4 w-[110%] h-[500px]">
            <h2 className="text-lg font-bold mb-4">Pending reservations</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2 text-left w-1/4">Workspace</th>
                  <th className="border-b py-2 text-left w-1/4">Desk</th>
                  <th className="border-b py-2 text-left w-1/4">Date</th>
                  <th className="border-b py-2 text-left w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((item) => {
                  return (
                    moment(item.occuredAt).date() > moment().date() &&
                    moment(item.occuredAt).month() >= moment().month() &&
                    !item?.canceled &&
                    !item.approved && (
                      <tr>
                        <td className="border-b py-2">
                          {item?.desk?.Floor?.floor!}
                        </td>
                        <td className="border-b py-2">{item?.desk?.name!}</td>
                        <td className="border-b py-2">
                          {moment(item?.occuredAt).format("dddd, MMMM D YYYY")}
                        </td>
                        <td className="border-b py-2">
                          <div className="flex justify-between items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="flex items-center text-lg text-foreground py-1 px-2 rounded"
                                >
                                  <FaMapMarkerAlt className="mr-2" /> View desk
                                  map
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="pt-[3rem]">
                                <Image
                                  src={`https://utfs.io/f/${item.desk?.Floor
                                    ?.image!}`}
                                  alt={item?.desk?.Floor?.floor!}
                                  width={500}
                                  height={500}
                                />
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="text-white text-sm py-0.5 px-0.5 rounded bg-red-500 mr-4 h-fit"
                                >
                                  <FaTimes />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Are you absolutely sure?
                                  </DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case "upcoming":
        return (
          <div className="border rounded p-4 w-[110%] h-[500px]">
            <h2 className="text-lg font-bold mb-4">Upcoming reservations</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2 text-left w-1/4">Workspace</th>
                  <th className="border-b py-2 text-left w-1/4">Desk</th>
                  <th className="border-b py-2 text-left w-1/4">Date</th>
                  <th className="border-b py-2 text-left w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((item) => {
                  return (
                    moment(item.occuredAt).date() > moment().date() &&
                    moment(item.occuredAt).month() >= moment().month() &&
                    !item?.canceled && (
                      <tr>
                        <td className="border-b py-2">
                          {item?.desk?.Floor?.floor!}
                        </td>
                        <td className="border-b py-2">{item?.desk?.name!}</td>
                        <td className="border-b py-2">
                          {moment(item?.occuredAt).format("dddd, MMMM D YYYY")}
                        </td>
                        <td className="border-b py-2">
                          <div className="flex justify-between items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="flex items-center text-lg text-foreground py-1 px-2 rounded"
                                >
                                  <FaMapMarkerAlt className="mr-2" /> View desk
                                  map
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="pt-[3rem]">
                                <Image
                                  src={`https://utfs.io/f/${item.desk?.Floor
                                    ?.image!}`}
                                  alt={item?.desk?.Floor?.floor!}
                                  width={500}
                                  height={500}
                                />
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="text-white text-sm py-0.5 px-0.5 rounded bg-red-500 mr-4 h-fit"
                                >
                                  <FaTimes />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Are you absolutely sure?
                                  </DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will
                                    permanently cancel your reservation.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    onClick={async () => {
                                      await cancelBooking(item.id!);
                                    }}
                                    variant={"destructive"}
                                  >
                                    Continue
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case "today":
        return (
          <div className="border rounded p-4 w-[110%] h-[500px]">
            <h2 className="text-lg font-bold mb-4">Booked desk today</h2>
            <table className="w-full text-left">
              {/*  */}
              <thead>
                <tr>
                  <th className="border-b py-2 text-left w-1/4">Workspace</th>
                  <th className="border-b py-2 text-left w-1/4">Desk</th>
                  <th className="border-b py-2 text-left w-1/4">
                    Booking Date
                  </th>
                  <th className="border-b py-2 text-left w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((item) => {
                  return (
                    moment(item.occuredAt).date() == moment().date() &&
                    moment(item.occuredAt).month() == moment().month() && (
                      <tr>
                        <td className="border-b py-2">
                          {item?.desk?.Floor?.floor!}
                        </td>
                        <td className="border-b py-2">{item?.desk?.name!}</td>
                        <td className="border-b py-2">
                          {moment(item?.bookedAt).format("dddd, MMMM D YYYY")}
                        </td>
                        <td className="border-b py-2">
                          <div className="flex justify-between items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="flex items-center text-lg text-foreground py-1 px-2 rounded"
                                >
                                  <FaMapMarkerAlt className="mr-2" /> View desk
                                  map
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="pt-[3rem]">
                                <Image
                                  src={`https://utfs.io/f/${item.desk?.Floor
                                    ?.image!}`}
                                  alt={item?.desk?.Floor?.floor!}
                                  width={500}
                                  height={500}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case "cancelled":
        return (
          <div className="border rounded p-4 w-[110%] h-[500px]">
            <h2 className="text-lg font-bold mb-4">Cancelled reservations</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2 text-left w-1/4">Workspace</th>
                  <th className="border-b py-2 text-left w-1/4">Desk</th>
                  <th className="border-b py-2 text-left w-1/4">Date</th>
                  <th className="border-b py-2 text-left w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((item) => {
                  return (
                    item.canceled && (
                      <tr>
                        <td className="border-b py-2">
                          {item?.desk?.Floor?.floor!}
                        </td>
                        <td className="border-b py-2">{item?.desk?.name!}</td>
                        <td className="border-b py-2">
                          {moment(item?.occuredAt).format("dddd, MMMM D YYYY")}
                        </td>
                        <td className="border-b py-2">
                          <div className="flex justify-between items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="flex items-center text-lg text-foreground py-1 px-2 rounded"
                                >
                                  <FaMapMarkerAlt className="mr-2" /> View desk
                                  map
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="pt-[3rem]">
                                <Image
                                  src={`https://utfs.io/f/${item.desk?.Floor
                                    ?.image!}`}
                                  alt={item?.desk?.Floor?.floor!}
                                  width={500}
                                  height={500}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case "history":
        return (
          <div className="border rounded p-4 w-[110%] h-[500px]">
            <h2 className="text-lg font-bold mb-4">History</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2 text-left w-1/4">Workspace</th>
                  <th className="border-b py-2 text-left w-1/4">Desk</th>
                  <th className="border-b py-2 text-left w-1/4">Date</th>
                  <th className="border-b py-2 text-left w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((item) => {
                  return (
                    moment(item?.occuredAt).date() < moment().date() &&
                    moment(item?.occuredAt).month() <= moment().month() && (
                      <tr className="h-12">
                        <td className="border-b py-2">
                          {item?.desk?.Floor?.floor!}
                        </td>
                        <td className="border-b py-2">{item?.desk?.name!}</td>
                        <td className="border-b py-2">
                          {moment(item?.occuredAt).format("dddd, MMMM D YYYY")}
                        </td>
                        <td className="border-b py-2">
                          <div className="flex justify-between items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={null}
                                  className="flex items-center text-lg text-foreground py-1 px-2 rounded"
                                >
                                  <FaMapMarkerAlt className="mr-2" /> View desk
                                  map
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="pt-[3rem]">
                                <Image
                                  src={`https://utfs.io/f/${item.desk?.Floor
                                    ?.image!}`}
                                  alt={item?.desk?.Floor?.floor!}
                                  width={500}
                                  height={500}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="flex mb-0 border-b">
        <button
          className={`flex-1 py-2 px-4 text-center mr-2 border rounded ${
            activeTab === "pending"
              ? "bg-black text-background"
              : "bg-background"
          }  text-foreground`}
          onClick={() => setActiveTab("pending")}
        >
          <FaCalendarCheck className="inline mr-2" /> Pending
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center mr-2 border rounded ${
            activeTab === "upcoming"
              ? "bg-black text-background"
              : "bg-transparent"
          } text-foreground`}
          onClick={() => setActiveTab("upcoming")}
        >
          <FaRegCalendarAlt className="inline mr-2" /> Upcoming
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center mr-2 border rounded ${
            activeTab === "today"
              ? "bg-black text-background"
              : "bg-transparent"
          } text-foreground`}
          onClick={() => setActiveTab("today")}
        >
          <FaClock className="inline mr-2" /> Today
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center mr-2 border rounded ${
            activeTab === "cancelled"
              ? "bg-black text-background"
              : "bg-transparent"
          } text-foreground`}
          onClick={() => setActiveTab("cancelled")}
        >
          <FaBan className="inline mr-2" /> Cancelled
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center border rounded ${
            activeTab === "history"
              ? "bg-black text-background"
              : "bg-transparent"
          } text-foreground`}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory className="inline mr-2" /> History
        </button>
      </div>
      {renderContent()}
    </div>
  );
}
