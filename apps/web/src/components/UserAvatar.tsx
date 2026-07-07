/* eslint-disable @next/next/no-img-element */

'use client';
import { useUser } from "@/lib/hooks/useUser";

interface UserAvatarProps {
    format: 'collapsed' | 'expanded';
}

export const UserAvatar = ({ format }: UserAvatarProps) => {
    const { user } = useUser();

    if (user) {
        if (format === 'collapsed') {
            return (
                <div className="h-8 w-8 rounded-full bg-gray-300">
                    <img
                        src={user.avatarUrl || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        alt="User Avatar"
                        className="cover rounded-full"
                    />
                    {/* <Image 
                        src={user.avatarUrl || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        alt="User Avatar"
                        className="cover rounded-full"
                        width={32}
                        height={32}
                    /> */}
                </div>
            );
        } else if (format === 'expanded') {
            return (
                <div className="flex items-center gap-2">
                    <img
                        src={user.avatarUrl || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full"
                    />
                    {/* <Image 
                        src={user.avatarUrl || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                    /> */}
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