"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { ModeToggle } from "./ModeToggler";
import { Suspense } from "react";
import { logoutUser } from "@/actions/actions";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";

function AvatarMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar>
            <AvatarImage
              src={
                session?.user.image ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
              }
            />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {session?.user.firstName} {session?.user.lastName}
            <br />
            <span className="text-xs text-slate-400 dark:text-100">
              {session?.user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-0"></DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {session?.user?.role === Role.admin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="p-0"></DropdownMenuItem>
                <DropdownMenuItem className="flex justify-start" asChild>
                  <Button
                    variant={null}
                    className="w-full h-8 cursor-pointer"
                    onClick={() => {
                      router.push("/activity-logs");
                    }}
                  >
                    Activity logs
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-start" asChild>
            <Button
              variant={null}
              className="w-full h-8 cursor-pointer"
              onClick={async () => {
                await logoutUser();
                signOut();
              }}
            >
              Sign out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AvatarMenu;
