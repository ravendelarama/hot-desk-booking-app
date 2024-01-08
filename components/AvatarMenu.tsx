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
import { logoutUser } from "@/actions/actions";

function AvatarMenu() {
  const { data: session } = useSession();

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
            <AvatarFallback>
              <Skeleton className="w-10 h-10 rounded-full" />
            </AvatarFallback>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-start" asChild>
            <Button
              variant={null}
              className="w-full cursor-pointer"
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
