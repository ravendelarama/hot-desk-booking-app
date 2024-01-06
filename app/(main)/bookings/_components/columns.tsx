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
          <HoverCardTrigger>
            {/* @ts-ignore */}
            {data?.firstName} {data?.lastName}
          </HoverCardTrigger>
          {/* @ts-ignore */}
          <HoverCardContent>
            <Avatar>
              <AvatarImage
                // @ts-ignore
                src={() => {
                  // @ts-ignore
                  if (data?.image) {
                    return {
                      // @ts-ignore
                      uri: data?.image!,
                    };
                  }
                  return "https://github.com/shadcn.png";
                }}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
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
