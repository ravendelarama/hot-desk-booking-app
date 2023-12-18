"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

function AvatarMenu() {
  const { data: session } = useSession();

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar>
            <AvatarImage src={session?.user.image} />
            <AvatarFallback>
              {(session?.user.firstName + session?.user.lastname).toUpperCase()}
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
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant={null}
              className="p-0 h-4"
              onClick={() => signOut()}
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
