"use client";

import SideBarSheet from "../SideBarSheet";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  MdOutlineDesk,
  MdOutlineManageAccounts,
  MdOutlineMapsHomeWork,
} from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import AvatarMenu from "../AvatarMenu";
import { ModeToggle } from "../ModeToggler";

import { GrScheduleNew } from "react-icons/gr";
import { GiDesk } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { RxActivityLog } from "react-icons/rx";
import { FiUserCheck } from "react-icons/fi";
import { PiUsersThree } from "react-icons/pi";
import { FaQ } from "react-icons/fa6";
import { BsFillJournalBookmarkFill } from "react-icons/bs";

const Routes = [
  {
    name: "Home",
    role: "user",
    alternative: "Home",
    path: "/home",
    icon: (options: string) => <GoHome className={options} />,
  },
  {
    name: "Colleagues",
    role: "admin",
    alternative: "Colleagues",
    path: "/employees",
    icon: (options: string) => <PiUsersThree className={options} />,
  },
  {
    name: "Bookings",
    role: "user",
    alternative: "Bookings",
    path: "/bookings",
    icon: (options: string) => (
      <BsFillJournalBookmarkFill className={options} />
    ),
  },
  {
    name: "Reserve",
    role: "user",
    alternative: "Reserve",
    path: "/desk",
    icon: (options: string) => <GrScheduleNew className={options} />,
  },
  {
    name: "Verifications",
    role: "admin",
    alternative: "Verifications",
    path: "/verification-requests",
    icon: (options: string) => <FiUserCheck className={options} />,
  },
  {
    name: "Floors",
    role: "manager",
    alternative: "Floors",
    path: "/floors",
    icon: (options: string) => <MdOutlineMapsHomeWork className={options} />,
  },
  {
    name: "Desks",
    role: "manager",
    alternative: "Desks",
    path: "/desks",
    icon: (options: string) => <GiDesk className={options} />,
  },
];

function Header() {
  const { data: session } = useSession();

  return (
    <div className="z-10 h-16 w-full fixed top-0 right-0 border-b border-slate-300 bg-white dark:bg-slate-950 dark:border-b-slate-800 sm:pl-72">
      <div className="h-full flex justify-between items-center px-6">
        <SideBarSheet title="HotDeskBooking">
          {Routes.map((item) => {
            if (
              !(
                session?.user.role == Role.manager ||
                session?.user.role == Role.admin
              ) &&
              (item.name == "Floors" || item.name == "Desks")
            ) {
              return null;
            }

            if (
              !(session?.user.role == Role.admin) &&
              (item.name == "Colleagues" || item.name == "Verifications")
            ) {
              return null;
            }

            return (
              <Button
                key={item.name}
                variant={null}
                className="w-full flex justify-start p-2 cursor-pointer"
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
