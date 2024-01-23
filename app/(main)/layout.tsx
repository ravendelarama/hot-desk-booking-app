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
    <div className="h-full flex overflow-auto dark:bg-slate-950">
      <SideBar />
      <div className="relative flex flex-col sm:ml-56 w-full">
        <Header />
        <div className="h-full w-full overflow-auto flex flex-col justify-between">
          <div className="sm:pr-6 pt-20 lg:pt-10">{children}</div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default layout;
