"use client";

import { useState } from "react";
import {
  BarChart3,
  LogOut,
  Shield,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../elements/Logo";
import { clearAuthCookies } from "@/lib/manage_token";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const routes = [
    { name: "Profile", icon: User, path: "/profile" },
    {
      name: "Security",
      icon: Shield,
      path: "/profile/security",
    },
  ];

  const isRouteActive = (routePath: string) => {
    if (routePath === "/profile") {
      return pathname === "/profile";
    }
    return pathname.startsWith(routePath);
  };

  const handleLogout = () => {
    clearAuthCookies();
    toast.success("Logout successful");
    router.push("/auth/sign-in");
    setOpenLogoutDialog(false); // close dialog after logout
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/15 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:top-0 lg:sticky top-0 left-0 h-screen lg:h-screen
          bg-white border-r border-gray-200 w-80
          z-50 lg:z-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between p-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo */}
          <div className="py-10">
            <Logo href="/employer-dashboard" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive = isRouteActive(route.path);
                return (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      onClick={() => onClose()}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-lg font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-[#854C3A] hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{route.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button with Confirmation Dialog */}
          <div className="absolute bottom-10 left-4 w-[calc(100%-2rem)]">
            <AlertDialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start gap-4 text-[#854C3A] text-lg font-semibold"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the sign-in page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;