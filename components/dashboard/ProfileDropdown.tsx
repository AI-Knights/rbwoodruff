"use client";
import { ChevronDown, LogOut, User } from "lucide-react";
import { ProfileImage } from "../shared/ProfileImage";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { useGetProfileInfoQuery } from "@/store/api/authSlice/authSlice";
import { usePathname } from "next/navigation";

const ProfileDropdown = () => {
  const pathname = usePathname();
  const { data } = useGetProfileInfoQuery();
  const isProfilePage = pathname === "/profile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`relative px-2 py-6 border  ${isProfilePage ? "bg-[#52B1FF] text-white border-none" : "text-black border-black"
            }`}
        >
          <ProfileImage
            src={data?.profile_pic}
            alt="Profile"
            className="size-10"
          />
          <h4 className="text-lg hidden md:block ml-2">{data?.full_name || "User"}</h4>
          <ChevronDown size={24} className="size-5 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
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