"use client";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import ProfileDropdown from "./ProfileDropdown";

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
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;