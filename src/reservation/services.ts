import { RoomEntity } from "../common/entities/room";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import { set as setError } from "../common/error/error";
import { create as createRepository } from "./repository";
import {
	updateAvailability as updateRoomRepository,
	findByType as findByTypeRepository,
	findById as findByIdRepository,
} from "../room/repository";

export const create = async (
	userId: string,
	roomId?: string,
	rooms?: RoomSearch[]
) => {
	try {
		let reservedRooms: RoomEntity[] = [];

		if (roomId) {
			reservedRooms = [await findByIdRepository(roomId)];
		} else if (rooms) {
			for await (const room of rooms) {
				reservedRooms = reservedRooms.concat(await findByTypeRepository(room));
			}
		} else {
			throw setError(400, "Request parameters missing");
		}

		await createRepository(userId, reservedRooms);

		for await (const reservedRoom of reservedRooms) {
			await updateRoomRepository(reservedRoom._id, {
				disponibility: false,
			} as RoomEntity);
		}

		return;
	} catch (err) {
		throw err;
	}
};
