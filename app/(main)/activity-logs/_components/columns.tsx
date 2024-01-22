"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { User } from "@prisma/client";
import { IoIosRemoveCircle, IoIosWarning } from "react-icons/io";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdDelete, MdManageAccounts } from "react-icons/md";
import { FaUserCheck, FaUserEdit } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteActivityLogById } from "@/actions/actions";

type Logs = {
  id: string;
  user: User;
  activity: string;
  message: string;
  occuredAt: Date;
  delete: string;
};

export const columns: ColumnDef<Logs>[] = [
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
                {/* @ts-ignore */}
                <AvatarImage src={data?.image} />
                <AvatarFallback>SD</AvatarFallback>
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Occuring Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "delete",
    header: "delete",
    cell: (props) => {
      const data = props.getValue();
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"warning"} size={"icon"}>
              <IoIosRemoveCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IoIosWarning className="h-7 w-7 inline" />
                Are you sure you want to delete this activity?
              </DialogTitle>
              {/** @ts-ignore */}
              <DialogDescription>
                This action cannot be undone. Once you delete a certain
                activity, the data will be completely removed from the database.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    await deleteActivityLogById(data as string);
                  }}
                >
                  {/* @ts-ignore */}
                  Continue
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
