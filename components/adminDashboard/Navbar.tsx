"use client";
import { usePathname } from "next/navigation";
import { Bell, CircleCheck, Info, Menu } from "lucide-react";
import { Button } from "../ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGetProfileInfoQuery } from "@/store/api/authSlice/authSlice";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/manage_token";
import { decodeToken } from "@/lib/manage_token/decode_token";
import Logo from "../elements/Logo";

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const pathname = usePathname();
  const { data } = useGetProfileInfoQuery()

  const token = getToken({ token_name: "access_token" });
  const user = decodeToken(token || "");




  const getPageTitle = (role: string | undefined): string => {
    switch (role) {
      case "admin":
        return "Administrator Dashboard";

      case "training_provider":
        return "Training Provider";

      case "employer":
        return "Employer Dashboard";

      case "agency":
        return "Agency Management";

      default:
        return "Dashboard";
    }
  };


  return (
    <nav className="bg-white lg:px-6 sticky top-0 z-30">
      <div className="flex items-center justify-between h-20 px-4 lg:px-0">
        <Logo />
        {/* Left side - Menu button and title */}
        <div className="flex lg:hidden items-center gap-2 ">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="size-6" />
            </Button>
          )}
          {/* <Logo /> */}
        </div>
        <div className="flex items-center justify-between space-x-4">
          {/* Mobile Menu Button - Only visible on mobile/tablet */}

          <h1 className="text-lg md:text-3xl font-semibold text-gray-800">
            {getPageTitle(user?.user_type)}
          </h1>

          {/* Right side - Profile */}
        </div>
        <div className="flex items-center justify-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn("cursor-pointer ", data?.user_type === "training_provider" ? "2xl:hidden" : "block")}>
              <Bell fill="black" size={24} className="size-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-[294px]">
              <DropdownMenuLabel className="flex items-center justify-start gap-4 text-lg font-semibold">
                Notification
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="flex items-center justify-start gap-4">
                  <Bell fill="black" className="size-5" />
                  <h3 className="font-semibold">New learners applied</h3>
                </div>
                <p className="text-xs ml-8">15 new applications for web dev program</p>
                <p className="text-[4B4B4B] font-semibold text-xs ml-8">Just Now</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="flex items-center justify-start gap-4">
                  <Info stroke="#FDAF37" className="size-5" />
                  <h3 className="font-semibold">New learners applied</h3>
                </div>
                <p className="text-xs ml-8">15 new applications for web dev program</p>
                <p className="text-[4B4B4B] font-semibold text-xs ml-8">10 mins ago</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="flex items-center justify-start gap-4">
                  <CircleCheck fill="#00BC7D" stroke="white" className="size-5" />
                  <h3 className="font-semibold">New learners applied</h3>
                </div>
                <p className="text-xs ml-8">15 new applications for web dev program</p>
                <p className="text-[4B4B4B] font-semibold text-xs ml-8">Just Now</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={"/profile"}>
            <Avatar className="size-16 border-2">
              <AvatarImage
                src={
                  data?.profile_pic ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                }
                className="size-16"
              />
              <AvatarFallback>PI</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
