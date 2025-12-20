import { Pipette, User as UserIcon, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Logo from "@/shared/ui/Logo";


export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);


    useEffect(() => {
        setIsEyeDropperSupported('EyeDropper' in window);
    }, []);


    const handleColorPick = async () => {
        if (!('EyeDropper' in window)) {
            toast.error('Color picker is not supported in your browser. Try Chrome, Edge, or Opera.');
            return;
        }

        try {
            // @ts-ignore
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();

            if (result?.sRGBHex) {
                await navigator.clipboard.writeText(result.sRGBHex);
                toast.success(`Color ${result.sRGBHex} copied to clipboard!`);
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                toast.error('Failed to pick color');
            }
        }
    };


    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <header className="disable-animation-on-theme-change sticky top-0 z-[100] w-full bg-background backdrop-blur-sm">
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                .pipette-button:hover {
                    animation: pulse 2s ease-in-out infinite;
                }
            `}</style>

            <div className="mx-auto flex w-full container items-center justify-between px-0 py-3 lg:py-5">
                <nav
                    className="flex items-center gap-6 md:gap-10"
                    aria-label="Primary navigation"
                >
                    <Logo />
                </nav>

                <div className="flex items-center gap-3 md:gap-3 relative z-50">
                    <div className="flex items-center gap-2">
                        <div className="transform-gpu origin-center hidden sm:block">
                            <button
                                onClick={handleColorPick}
                                disabled={!isEyeDropperSupported}
                                className="bg-card border rounded-[8px] p-2"
                                aria-label="Pick color from screen"
                                title={isEyeDropperSupported ? "Pick color from screen" : "Not supported in this browser"}
                            >
                                <Pipette size={18} className="transition-transform" />
                                <span className="sr-only">Pick color from screen</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center relative">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-ring/70 rounded-full relative z-50">
                                    <Avatar className="h-9 w-9  border-2 border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:scale-110">
                                        <AvatarImage src={user.picture} alt={user.name} />
                                        <AvatarFallback
                                            className="bg-cover bg-center text-white font-semibold"
                                            style={{ backgroundImage: 'url("https://vercel.com/api/www/avatar/SA7kRQYuUGOPuPmxWAQycgXZ")' }}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={8}
                                    className="w-56 bg-gray-950/90 dark:bg-gray-950/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden z-[150]"
                                >
                                    <DropdownMenuLabel className="backdrop-blur-sm px-3 py-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none text-white">{user.name}</p>
                                            <p className="text-xs leading-none text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10 my-1" />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-gray-200 hover:text-white focus:bg-white/10 hover:bg-white/10 focus:text-white transition-all duration-200 rounded-lg mx-2 my-1"
                                        asChild
                                    >
                                        <a href="/profile" className="flex items-center px-2 py-1.5">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10 my-1" />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/20 focus:bg-red-500/30 focus:text-red-300 transition-all duration-200 rounded-lg mx-2 my-1 px-2 py-1.5"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-card border rounded-[8px] py-1 px-2"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="block w-full px-5 lg:px-14">
                <div
                    className="h-[1px] w-full opacity-50"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, var(--muted-foreground) 0%, var(--muted-foreground) 2px, transparent 2px, transparent 12px)",
                        backgroundSize: "6px 1px",
                    }}
                ></div>
            </div>
        </header>
    );
};
