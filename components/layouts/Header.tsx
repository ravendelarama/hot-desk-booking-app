"use client";

import SideBarSheet from "../SideBarSheet";
import { Button } from "../ui/button";
import Link from "next/link";
import { MdOutlineDesk } from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import AvatarMenu from "../AvatarMenu";
import { ModeToggle } from "../ModeToggler";

import { FaUsers } from "react-icons/fa";
import { GoHome } from "react-icons/go";

const Routes = [
  {
    name: "Employees",
    path: "/employees",
    icon: (options: string) => <FaUsers className={options} />,
  },
  {
    name: "Home",
    path: "/home",
    icon: (options: string) => <GoHome className={options} />,
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: (options: string) => <BiBookBookmark className={options} />,
  },
  {
    name: "Desk",
    path: "/desk",
    icon: (options: string) => <MdOutlineDesk className={options} />,
  },
];

function Header() {
  return (
    <div className="z-10 h-20 w-full fixed top-0 right-0 border-b border-slate-300 bg-white dark:bg-slate-950 dark:border-b-slate-800 sm:pl-72">
      <div className="h-full flex justify-between items-center px-6">
        <SideBarSheet title="HotDeskBooking">
          {Routes.map((item) => {
            return (
              <Button
                key={item.name}
                variant={null}
                className="w-full flex justify-start p-2"
                asChild
              >
                <Link
                  href={item.path}
                  className="flex justify-start items-center gap-3 transition-colors duration-75 ease-in hover:bg-slate-100 hover:dark:bg-slate-900"
                >
                  {item.icon("w-6 h-6")}
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </SideBarSheet>
        <div className="flex items-center justify-start gap-3">
          <AvatarMenu />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Header;
