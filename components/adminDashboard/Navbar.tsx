"use client";
import { CircleCheck, Info, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ProfileImage } from "../shared/ProfileImage";
import Link from "next/link";
import NotificationBell from "../dashboard/NotificationBell";

import { useGetProfileInfoQuery } from "@/store/api/authSlice/authSlice";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/manage_token";
import { decodeToken } from "@/lib/manage_token/decode_token";
import Logo from "../elements/Logo";

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
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
          <NotificationBell />
          <Link href={"/profile"}>
            <ProfileImage
              src={data?.profile_pic}
              alt="Profile"
              className="size-12 border-2"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
