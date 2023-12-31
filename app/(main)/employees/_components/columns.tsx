"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Role, User } from "@prisma/client";
import { Suspense, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
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
import { deleteUserById } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "../../bookings/_components/data-table";
import UpdateRow from "./UpdateRow";
import { Skeleton } from "@/components/ui/skeleton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Employee = {
  image: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  role: Role;
  isBanned: boolean;
  edit: object;
  delete: string;
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "image",
    header: "image",
    cell: (props) => {
      return (
        <Avatar>
          <AvatarImage
            // @ts-ignore
            src={
              props.getValue() ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
            }
          />
          <AvatarFallback>
            {" "}
            <Skeleton className="w-10 h-10 rounded-full" />
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (props) => {
      return (
        <Suspense fallback={<Skeleton className="w-32 h-4 rounded-lg" />}>
          {/* @ts-ignore */}
          <p>{props.getValue()}</p>
        </Suspense>
      );
    },
  },

  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: (props) => {
      return (
        <Suspense fallback={<Skeleton className="w-32 h-4 rounded-lg" />}>
          {/* @ts-ignore */}
          <p>{props.getValue()}</p>
        </Suspense>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isBanned",
    header: "isBanned",
  },
  {
    accessorKey: "edit",
    header: "edit",
    cell: (props) => {
      const data = props.getValue();
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"} size={"icon"}>
              <MdEdit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <UpdateRow data={data} />
          </DialogContent>
        </Dialog>
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
            <Button variant={"destructive"} size={"icon"}>
              <MdDelete className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this user?
              </DialogTitle>
              {/** @ts-ignore */}
              <DialogDescription>
                This action cannot be undone. Once you delete a certain user,
                the data will be completely removed from the database.
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
                    const response = await deleteUserById(data as string);
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
