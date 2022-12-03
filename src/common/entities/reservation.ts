import { RoomEntity } from "./room";
import { UserEntity } from "./user";

export interface ReservationEntity {
	id: string;
	userId: string;
	rooms: RoomEntity[];
	date: Date | string;
}
