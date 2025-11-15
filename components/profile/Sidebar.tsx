"use client";
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

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter()
  const routes = [
    { name: "Profile", icon: User, path: "/profile-admin" },
    {
      name: "Security",
      icon: Shield,
      path: "/profile-admin/security",
    },
  ];

  // Helper function to check if route is active
  const isRouteActive = (routePath: string) => {
    // Exact match for dashboard overview
    if (routePath === "/profile-admin") {
      return pathname === "/profile-admin";
    }
    // For other routes, check if pathname starts with the route path
    return pathname.startsWith(routePath);
  };

  const handleLogout =()=>{
    router.push("/")
  }

  return (
    <>
      {/* Mobile/Tablet Overlay - Only shows when sidebar is open on small screens */}
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
          {/* Logo */}
          <div className="flex items-center justify-between p-2 lg:hidden">
            {/* Close button - Only visible on mobile/tablet */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
            <div className="py-10">
                <Logo href="/employer-dashboard"/>
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
                      onClick={() => onClose()} // Close sidebar on mobile when clicking a link
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
          <Button onClick={handleLogout} variant={"ghost"} className="absolute bottom-10 left-4 flex items-center gap-4 text-[#854C3A] text-lg font-semibold">
              <LogOut/>
              Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;