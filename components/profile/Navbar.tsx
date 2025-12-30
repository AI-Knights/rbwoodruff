"use client";
import {Menu } from "lucide-react";
import { Button } from "../ui/button";

import { decodeToken } from "@/lib/manage_token/decode_token";
import { getToken } from "@/lib/manage_token";

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
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
        <div className="w-full">

          <h1 className="text-lg md:text-3xl font-semibold text-gray-800">
            {getPageTitle(user?.user_type)}
          </h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
