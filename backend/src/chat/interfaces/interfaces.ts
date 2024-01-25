import { Message, Recent } from "@prisma/client";

export interface ChatRoomUsers {
    user: {
        id: number;
        username: string;
        image: string;
        status: string;
    };
}

export interface duration {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}
export type msgRecent = {
    msgData: Message;
    recentData?: Recent[];
}