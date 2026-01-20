"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { getAccessToken } from "@/lib/manage_token";
import { API_BASE_URL } from "@/lib/api_config";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

// Define Notification type
interface Notification {
    id: string;
    notification_type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    data: any;
}

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Polling interval in milliseconds (30 seconds)
    const POLLING_INTERVAL = 30000;

    const fetchNotifications = async () => {
        const token = getAccessToken();
        if (!token) return;

        try {
            // Fetch unread count
            const countRes = await fetch(`${API_BASE_URL}/users/notifications/unread-count/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (countRes.ok) {
                const data = await countRes.json();
                setUnreadCount(data.unread_count);
            }

            // If popover is open, fetch list
            if (isOpen) {
                setLoading(true);
                const listRes = await fetch(`${API_BASE_URL}/users/notifications/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (listRes.ok) {
                    const data = await listRes.json();
                    // Handle pagination result if necessary
                    const results = Array.isArray(data) ? data : (data.results || []);
                    setNotifications(results);
                }
                setLoading(false);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setLoading(false);
        }
    };

    // Initial fetch and polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, [isOpen]);

    // Auto-mark as read when opened
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    }, [isOpen]);

    const markAsRead = async (id: string) => {
        const token = getAccessToken();
        if (!token) return;

        try {
            await fetch(`${API_BASE_URL}/users/notifications/${id}/read/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllAsRead = async () => {
        const token = getAccessToken();
        if (!token) return;

        try {
            await fetch(`${API_BASE_URL}/users/notifications/mark-all-read/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'training_enrolled': return 'text-blue-500 bg-blue-50';
            case 'certificate_uploaded': return 'text-orange-500 bg-orange-50';
            case 'certificate_verified': return 'text-green-500 bg-green-50';
            case 'certificate_rejected': return 'text-red-500 bg-red-50';
            case 'job_applied': return 'text-purple-500 bg-purple-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-lg p-0 bg-white border border-gray-300 hover:bg-gray-50"
                >
                    <Bell className="h-6 w-6 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold leading-none">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {loading && notifications.length === 0 ? (
                        <div className="flex justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <div className="space-y-1">
                                            <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
