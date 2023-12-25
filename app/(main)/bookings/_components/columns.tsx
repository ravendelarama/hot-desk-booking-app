"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

type Bookings = {
  id: string;
  userId: string;
  deskId: string;
  status: string;
  startedAt: Date;
  endedAt: Date;
  bookedAt: Date;
};

export const columns: ColumnDef<Bookings>[] = [
  {
    accessorKey: "userId",
    header: "UserId",
  },
  {
    accessorKey: "deskId",
    header: "DeskId",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "startedAt",
    header: "Started Date",
  },
  {
    accessorKey: "endedAt",
    header: "Ended Date",
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
