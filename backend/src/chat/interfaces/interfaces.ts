import { Message, Recent } from "@prisma/client";

export interface ChatRoomUsers {
    user: {
        id: number;
        username: string;
        image: string;
        status: string;
    };
}

export type msgRecent = {
    msgData: Message;
    recentData?: Recent[];
}
