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

import { DeskStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { deleteDeskById } from "@/actions/actions";
import { IoIosWarning } from "react-icons/io";
import UpdateRow from "./UpdateRow";
// import UpdateRow from "./UpdateRow";

type Desks = {
  id: string;
  floor: string;
  name: string;
  coordinates: string[];
  status: DeskStatus;
  edit: object;
  delete: string;
};

export const columns: ColumnDef<Desks>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (props) => {
      const data = props.getValue();
      // @ts-ignore
      return data;
    },
  },
  {
    accessorKey: "floor",
    header: "Floor",
    cell: (props) => {
      const data = props.getValue();
      // @ts-ignore
      return data;
    },
  },
  {
    accessorKey: "coordinates",
    header: "Coordinates",
    cell: (props) => {
      const data = props.getValue();
      // @ts-ignore
      return data.join(",");
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
          variant={data == DeskStatus.available ? "success" : "destructive"}
        >
          {/* @ts-ignore */}
          {data}
        </Badge>
      );
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
                Are you sure you want to delete all the activities?
              </DialogTitle>
              {/** @ts-ignore */}
              <DialogDescription>
                This action cannot be undone. Once you delete a certain desk,
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
                    await deleteDeskById(data as string);
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
