"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { MdEdit } from "react-icons/md";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Desk, User } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { MdManageAccounts } from "react-icons/md";
import { FaUserCheck, FaUserEdit } from "react-icons/fa";

type Bookings = {
  id: string;
  user: User;
  desk: Desk;
  status: string;
  occuredAt: Date;
  bookedAt: Date;
};

export const columns: ColumnDef<Bookings>[] = [
  {
    accessorKey: "user",
    header: "user",
    cell: (props) => {
      const data = props.getValue();
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant={null}>
              {/* @ts-ignore */}
              {data?.firstName} {data?.lastName}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="md:w-600">
            <div className="flex gap-3 justify-between h-full">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <h1 className="text-left">
                        {/* @ts-ignore */}
                        {data?.firstName} {data?.lastName}
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex justify-start w-full">
                      {/* @ts-ignore */}
                      {data?.role == "admin" ? (
                        <MdManageAccounts className="text-indigo-500 h-5 w-5" />
                      ) : // @ts-ignore
                      data?.role == "manager" ? (
                        <FaUserEdit className="text-blue-300 h-4 w-4" />
                      ) : (
                        <FaUserCheck className="h-4 w-4" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {/* @ts-ignore */}
                      <p>{data?.role}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex justify-start w-full">
                      <p className="text-xs font-bold break-all text-left">
                        {/* @ts-ignore */}
                        {data?.email}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "desk",
    header: "desk",
    cell: (props) => {
      const data = props.getValue();
      // @ts-ignore
      return data.name;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => {
      const data = props.getValue();

      return (
        <Badge
          className="w-fit"
          variant={
            data === "no_show"
              ? "default"
              : data === "canceled"
              ? "destructive"
              : data === "checked_out"
              ? "secondary"
              : data === "checked_in"
              ? "success"
              : "warning"
          }
        >
          {/* @ts-ignore */}
          {data}
        </Badge>
      );
    },
  },
  {
    accessorKey: "occuredAt",
    header: "Occuring Date",
  },
  {
    accessorKey: "bookedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
