"use client";
import { ChevronDown, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileDropdown = () => {
  const pathname = usePathname();
  const isProfilePage = pathname === "/dashboard/settings";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`relative px-2 py-6 border  ${
            isProfilePage ? "bg-[#52B1FF] text-white border-none" : "text-black border-black"
          }`}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Profile"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h4 className="text-lg hidden md:block">Alex David</h4>
          <ChevronDown size={24} className="size-5"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <Link href={"/"}>
          <DropdownMenuItem onClick={() => console.log('Logout')} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;