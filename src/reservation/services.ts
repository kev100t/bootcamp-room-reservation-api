import { RoomEntity } from "../common/entities/room";
import { UserEntity } from "../common/entities/user";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import { create as createRepository } from "./repository";
import {
	updateAvailability as updateRoomRepository,
	findByType as findByTypeRepository,
} from "../room/repository";

export const create = async (
	user: UserEntity,
	room?: RoomEntity,
	roomTypes?: RoomSearch[]
) => {
	try {
		let reservedRooms: RoomEntity[];
		if (room) reservedRooms = [room];
		else if (roomTypes) reservedRooms = await findByTypeRepository(roomTypes);
		else throw Error("Bad Request");
		const reservation = await createRepository(user, reservedRooms);
		reservedRooms.forEach((room) =>
			updateRoomRepository(room.id, { disponibility: false })
		);
		return reservation;
	} catch (err) {
		throw err;
	}
};
