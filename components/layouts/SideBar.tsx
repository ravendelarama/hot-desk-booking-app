import SideBarSheet from "../SideBarSheet";
import { Button } from "../ui/button";
import Link from "next/link";
import { MdOutlineDesk } from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { GoHome } from "react-icons/go";

const Routes = [
  {
    name: "Home",
    path: "/home",
    icon: (options: string) => <GoHome className={options} />,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: (options: string) => <FaUsers className={options} />,
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

function SideBar() {
  return (
    <div className="z-20 w-72 p-5 h-screen bg-white fixed top-0 left-0 hidden border-r border-r-slate-300 dark:border-r-slate-800 dark:bg-slate-950 sm:block">
      <div className="h-20 flex space-x-3">
        <h1>HotDeskBooking</h1>
      </div>
      <div>
        {Routes.map((item) => {
          return (
            <Button
              key={item.name}
              variant={null}
              className="w-full flex justify-start px-4 py-2 gap-3 transition-colors duration ease-in hover:bg-slate-100 hover:dark:bg-slate-900"
              asChild
            >
              <Link href={item.path}>
                {item.icon("w-6 h-6")}
                {item.name}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
