"use client";

import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";

import { ColumnDef } from "@tanstack/react-table";
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

import { deleteDeskById, deleteFloorById } from "@/actions/actions";
import { IoIosWarning } from "react-icons/io";
import UpdateRow from "./UpdateRow";
import Link from "next/link";
import { FileUploader } from "react-drag-drop-files";
import { ArrowUpDown } from "lucide-react";

type Floors = {
  id: string;
  name: string;
  image?: string;
  edit: object;
  delete: string;
};

export const columns: ColumnDef<Floors>[] = [
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
      const data = props.getValue();
      // @ts-ignore
      return data;
    },
  },

  {
    accessorKey: "image",
    header: "Image",
    cell: (props) => {
      const data = props.getValue();
      if (data) {
        // @ts-ignore
        let arr = data.split("/");
        return (
          // @ts-ignore
          <Link href={data} target="_" className="text-ellipsis overlow-hiden">
            {arr[arr.length - 1]}
          </Link>
        );
      }
      return null;
    },
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
            {/* @ts-ignore */}
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
              <DialogTitle className="flex items-center gap-2">
                <IoIosWarning className="h-7 w-7 inline" />
                Are you sure you want to delete this floor?
              </DialogTitle>
              {/** @ts-ignore */}
              <DialogDescription>
                This action cannot be undone. Once you delete a certain floor,
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
                    await deleteFloorById(data as string);
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
