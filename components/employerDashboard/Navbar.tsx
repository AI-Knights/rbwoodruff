"use client";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { getToken } from "@/lib/manage_token";
import { decodeToken } from "@/lib/manage_token/decode_token";
import { useGetProfileInfoQuery } from "@/store/api/authSlice/authSlice";

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
  console.log(user);


  return (
    <nav className="bg-white lg:px-6 sticky top-0 z-30">
      <div className="flex items-center justify-between h-20 px-4 lg:px-0">
        {/* Left side - Menu button and title */}
        <div className="flex lg:hidden items-center gap-2">
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
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link href={"/profile"}>
            <Avatar className="size-16 border-2">
              <AvatarImage
                src={
                  data?.profile_pic ? data.profile_pic : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
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
