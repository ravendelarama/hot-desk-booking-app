"use client";

import { ReactNode } from "react";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiMenu } from "react-icons/fi";

interface Prop {
  children?: ReactNode;
  title?: string;
  description?: string;
}

function SideBarSheet({ children, title, description }: Prop) {
  return (
    <div className="w-full">
      <Sheet>
        <SheetTrigger asChild className="sm:hidden">
          <Button variant={null}>
            <FiMenu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:hidden">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-start w-full">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SideBarSheet;
