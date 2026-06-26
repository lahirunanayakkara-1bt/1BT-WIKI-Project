// import { auth } from "@/lib/auth/server";

import { authClient } from "@/lib/auth/client";
import { useEffect, useState } from "react";

interface UserAvatarProps {
    format: 'collapsed' | 'expanded';
}

interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    banned: boolean | null | undefined;
    role?: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
    phoneNumber?: string | null | undefined;
    phoneNumberVerified?: boolean | null | undefined;
}

// export const dynamic = 'force-dynamic';

export const UserAvatar = ({ format }: UserAvatarProps) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const { data:session } = await authClient.getSession()
            if (session?.user) {
                setUser(session.user);
            }
        }
        fetchUser();
    }, [])

    if (user) {
        if (format === 'collapsed') {
            return (
                <div className="h-8 w-8 rounded-full bg-gray-300">
                    <img
                        src={user.image || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        alt="User Avatar"
                        className="cover rounded-full"
                    />
                </div>
            );
        } else if (format === 'expanded') {
            return (
                <div className="flex items-center gap-2">
                    <img
                        src={user.image || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-400">{user.name}</span>
                        <span className="text-xs font-medium text-gray-500">{user.role}</span>
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-700">Guest</span>
            </div>
        );
    }
}