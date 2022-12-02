import { RoomEntity } from "./room";
import { UserEntity } from "./user";

export interface ReservationEntity {
	id: string;
	user: UserEntity;
	rooms: RoomEntity[];
	date: Date;
}
