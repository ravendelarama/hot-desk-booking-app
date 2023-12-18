"use client";

import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import SideBar from "@/components/layouts/SideBar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface Prop {
  children?: ReactNode;
}

function layout({ children }: Prop) {
  return (
    <div className="min-h-screen flex overflow-hidden dark:bg-slate-950">
      <SideBar />
      <div className="relative flex flex-col sm:ml-72 w-full">
        <Header />
        <div className="h-full w-full sm:pr-10 pt-20 overflow-auto">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default layout;
