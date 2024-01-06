"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

type Bookings = {
  id: string;
  userId: string;
  activity: string;
  occuredAt: Date;
};

export const columns: ColumnDef<Bookings>[] = [
  {
    accessorKey: "userId",
    header: "UserId",
  },
  {
    accessorKey: "activity",
    header: "Activity",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "occuredAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Occuring Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
