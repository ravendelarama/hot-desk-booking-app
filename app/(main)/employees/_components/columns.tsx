"use client";

import { Suspense } from "react";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { deleteUserById } from "@/actions/user";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
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
import UpdateRow from "./UpdateRow";
import { Skeleton } from "@/components/ui/skeleton";

export type Employee = {
  image: string | null;
  name: string;
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (props) => {
      return (
        <Suspense fallback={<Skeleton className="w-32 h-4 rounded-lg" />}>
          {/* @ts-ignore */}
          <p className="truncate">{props.getValue()}</p>
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
                    await deleteUserById(data as string);
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
