// src/shared/layout/Navbar/NavbarUserMenu.tsx

import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Letter3DSwap from "@/shared/components/fancy/text/Letter3DSwap";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";
import { getFullImageUrl } from "@/shared/utils/imageUrl";

interface NavbarUserMenuProps {
  user: {
    name: string;
    email: string;
    picture?: string;
    role: "user" | "admin";
  } | null;
  onLogout: () => void;
  loading?: boolean;
}

export const NavbarUserMenu = ({
  user,
  onLogout,
  loading = false
}: NavbarUserMenuProps) => {
  // Check loading FIRST before anything else
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  // Then check if user exists
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="rounded-[8px] bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  // Finally, show the user menu
  return (
    <div className="relative flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-ring/70 relative z-50 rounded-full outline-none focus-visible:ring-2">
          <Avatar className="h-9 w-9 border-2 border-white/10 backdrop-blur-sm transition-all duration-300">
            <AvatarImage src={getFullImageUrl(user.picture)} alt={user.name} />
            <AvatarFallback
              className="bg-cover bg-center font-semibold text-white"
              style={{
                backgroundImage:
                  'url("https://vercel.com/api/www/avatar/SA7kRQYuUGOPuPmxWAQycgXZ")',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-[150] w-56 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/90 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl dark:bg-gray-950/90"
        >
          <DropdownMenuLabel className="px-3 py-2 backdrop-blur-sm">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none text-white">
                {user.name}
              </p>
              <p className="truncate text-xs leading-none text-gray-400">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 bg-white/10" />

          <DropdownMenuItem
            className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            asChild
          >
            <Link to="/profile" className="flex items-center px-2 py-1.5">
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            asChild
          >
            <Link to="/favorites" className="flex items-center px-2 py-1.5">
              <span>Favorites</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            asChild
          >
            <Link to="/my-gradients" className="flex items-center px-2 py-1.5">
              <span>My Gradients</span>
            </Link>
          </DropdownMenuItem>

          {user.role === "admin" && (
            <>
              <DropdownMenuSeparator className="my-1 bg-white/10" />
              <DropdownMenuItem
                className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"

                asChild
              >
                <Link to="/admin" className="flex items-center px-2 py-1.5">
                  <span className="font-semibold">Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-1 bg-white/10" />

          <DropdownMenuItem
            className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            asChild
          >
            <Link to="/ai-generator" className="flex items-center px-2 py-1.5">
              <span>AI Generator</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            asChild
          >
            <Link to="/support" className="flex items-center px-2 py-1.5">
              <span>Support</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-white/10" />

          <DropdownMenuItem
            className="mx-2 my-1 cursor-pointer rounded-lg px-2 py-1.5 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/30 focus:text-red-300"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
