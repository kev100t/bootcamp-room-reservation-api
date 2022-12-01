import { Room } from "../interfaces/room.inteface";
import { User } from "../interfaces/user.interface";
import { create as createRepository } from "./repository";
import {
	updateAvailability as updateRoomRepository,
	findByType as findByTypeRepository,
} from "../room/repository";
import { RoomSearch } from "../interfaces/reservation.interface";

export const create = async (
	user: User,
	room?: Room,
	roomTypes?: RoomSearch[]
) => {
	try {
		let reservedRooms: Room[];
		if (room) reservedRooms = [room];
		else if (roomTypes) reservedRooms = await findByTypeRepository(roomTypes);
		else throw Error("Bad Request");
		const reservation = await createRepository(user, reservedRooms);
		// reservedRooms.forEach(room => updateRoomRepository(room));
		reservedRooms.forEach(() => updateRoomRepository());
		return reservation;
	} catch (err) {
		throw err;
	}
};
