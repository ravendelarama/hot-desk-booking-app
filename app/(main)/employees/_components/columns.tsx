"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Role, User } from "@prisma/client";
import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteUserById } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Employee = {
  image: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  role: Role;
  edit: object;
  delete: string;
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "user",
    header: "image",
    cell: (props) => {
      return (
        <Avatar>
          {/* @ts-ignore */}
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
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
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "edit",
    header: "edit",
    cell: (props) => {
      const [value, setValue] = useState<Employee | null>(null);
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => {
                const data = props.getValue();
                // @ts-ignore
                setValue(data);
              }}
            >
              <MdEdit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              {/** @ts-ignore */}
              <DialogDescription>{value?.role}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "delete",
    header: "delete",
    cell: (props) => {
      const [value, setValue] = useState<string | null>(null);
      const { toast } = useToast();
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => {
                const data = props.getValue();
                // @ts-ignore
                setValue(data);
              }}
            >
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
                {value}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end items-center gap-5">
              <Button variant={"secondary"}>Cancel</Button>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  const response = await deleteUserById(value!);
                  toast({
                    title: "Delete User",
                    description: response.message,
                  });
                }}
              >
                {/* @ts-ignore */}
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
