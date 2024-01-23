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