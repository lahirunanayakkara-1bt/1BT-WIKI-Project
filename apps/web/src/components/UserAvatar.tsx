/* eslint-disable @next/next/no-img-element */

'use client';
import { useUser } from "@/lib/hooks/useUser";

interface UserAvatarProps {
    format: 'collapsed' | 'expanded';
}

export const UserAvatar = ({ format }: UserAvatarProps) => {
    const { user } = useUser();

    if (user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        if (format === 'collapsed') {
            return (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <span className="text-xs font-semibold text-gray-700">{initials}</span>
                    )}
                </div>
            );
        } else if (format === 'expanded') {
            return (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="User Avatar"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span className="text-xs font-semibold text-gray-700">{initials}</span>
                        )}
                    </div>
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
                <div className="h-8 w-8 rounded-full bg-gray-300 shrink-0"></div>
                <span className="text-sm font-medium text-gray-700">Guest</span>
            </div>
        );
    }
}