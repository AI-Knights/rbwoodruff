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

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const pathname = usePathname();

  // Split the path
  const parts = pathname.split("/").filter(Boolean);

  // Define titles for specific routes
  const getPageTitle = (path: string) => {
    const routes: { [key: string]: string } = {
      dashboard: "Admin Overview",
      "student-management": "Management Student",
      moderation: "Moderation",
      "manage-module": "Manage Module",
      profile: "Profile",
      "manage-question": "Manage Question",
      "quiz-configuration": "Quiz Configuration",
      settings: "Profile",
    };

    // Check if we're on a nested route under manage-question
    if (pathname.startsWith("/dashboard/manage-question")) {
      return "Manage Question";
    }

    // last part of the path (eg. "profile")
    const last = parts[parts.length - 1];
    return routes[last] || "Dashboard";
  };

  return (
    <nav className="bg-white lg:px-6 sticky top-0 z-30">
      <div className="flex items-center justify-between h-20 px-4 lg:px-0">
        {/* Left side - Menu button and title */}
        <div className="flex items-center gap-2">
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
            {getPageTitle(pathname)}
          </h1>

          {/* Right side - Profile */}
        </div>
        <div className="flex items-center justify-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Bell fill="black" size={24} className="size-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-[294px]">
              <DropdownMenuLabel className="flex items-center justify-start gap-4 text-lg font-semibold">
                Notification
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="flex items-center justify-start gap-4">
                  <Bell fill="black" className="size-5"/>
                  <h3 className="font-semibold">New learners applied</h3>
                </div>
                <p className="text-xs ml-8">15 new applications for web dev program</p>
                <p className="text-[4B4B4B] font-semibold text-xs ml-8">Just Now</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="flex items-center justify-start gap-4">
                  <Info stroke="#FDAF37" className="size-5"/>
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
          <Link href={"/profile-admin"}>
            <Avatar className="size-16 border-2">
              <AvatarImage
                src={
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
