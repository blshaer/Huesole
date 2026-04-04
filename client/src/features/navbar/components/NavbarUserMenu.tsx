import { motion } from "framer-motion";
import { ChevronRight, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { User } from "@/features/auth/context/AuthContext";
import { getFullImageUrl } from "@/shared/utils/imageUrl";

interface NavbarUserMenuProps {
  user: User;
  loading: boolean;
  onLogout: () => void;
}

const textVariants = {
  initial: { opacity: 1, x: 0 },
  hover: { opacity: 0, x: -15 },
};

const iconVariants = {
  initial: { opacity: 0, x: 15 },
  hover: { opacity: 1, x: 0 },
};

export function NavbarUserMenu({ user, loading, onLogout }: NavbarUserMenuProps) {
  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <motion.button
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden flex items-center justify-center w-[130px] h-9 bg-[#edf0f1] text-black border border-black/10 rounded-md font-medium text-xs shadow-sm"
          >
            <motion.span
              variants={textVariants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              Start Generating
            </motion.span>

            <motion.span
              variants={iconVariants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
            </motion.span>
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-full border border-border hover:opacity-90 transition-all active:scale-95 shadow-sm outline-none">
          <Avatar className="h-full w-full">
            <AvatarImage
              src={getFullImageUrl(user.picture)}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-[#92A1C6] via-[#146A7C] to-[#C271B4] text-white text-[10px] font-bold uppercase transition-all">
              {user.name
                ? user.name.split(" ").length > 1
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  : user.name.slice(0, 2)
                : "UA"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border-border z-[9999]">
        <DropdownMenuLabel className="font-normal px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none truncate max-w-[180px]">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground opacity-70 hover:text-primary transition-colors truncate max-w-[180px]">
              {user.username ? `@${user.username}` : user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        
        {user.role === "admin" && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}