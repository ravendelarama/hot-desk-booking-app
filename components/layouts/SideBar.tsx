import Link from "next/link";
import textPicDark from "@/public/text-dark.png";
import textPicLight from "@/public/text-light.png";
import Image from "next/image";
import { Role } from "@prisma/client";

import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

import { Button } from "../ui/button";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { GrScheduleNew } from "react-icons/gr";
import { GiDesk } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { FiUserCheck } from "react-icons/fi";
import { PiUsersThree } from "react-icons/pi";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { LuSettings } from "react-icons/lu";

const Routes = [
  {
    name: "Home",
    role: "user",
    alternative: "Home",
    path: "/",
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
  {
    name: "Settings",
    role: "user",
    alternative: "Settings",
    path: "/settings",
    icon: (options: string) => <LuSettings className={options} />,
  },
];

function SideBar() {
  const { data: session } = useSession();
  const { theme } = useTheme();

  return (
    <div className="z-20 w-56 p-5 h-screen bg-white fixed top-0 left-0 hidden border-r border-r-slate-300 dark:border-r-slate-800 dark:bg-slate-950 sm:block">
      {theme == "dark" ? (
        <Image src={textPicLight} alt="" width={100} height={3} />
      ) : (
        <Image src={textPicDark} alt="" width={100} height={3} />
      )}
      <div>
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

          // if (!(session?.user?.role == Role.user) && item.name == "Settings") {
          //   return null;
          // }

          return (
            <Button
              key={item.name}
              variant={null}
              className="w-full flex justify-start px-4 py-2 gap-3 transition-colors duration ease-in hover:bg-slate-100 hover:dark:bg-slate-900"
              asChild
            >
              <Link href={item.path} className="text-lg">
                {item.icon("w-6 h-6")} {item.name}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
