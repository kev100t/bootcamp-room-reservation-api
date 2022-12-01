import { Room } from "./room.inteface";
import { User } from "./user.interface";

export interface Reservation {
	id: string;
	rooms: Room[];
	user: User;
	date: Date;
}

export interface RoomSearch {
	type: string;
	count: number;
}
