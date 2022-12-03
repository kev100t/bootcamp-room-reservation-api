import { RoomEntity } from "../common/entities/room";
import {
	create as createRepository,
	list as listRepository,
	update as updateRepository,
	updateAvailability as updateAvailabilityRepository,
} from "./repository";

export const create = async () => {
	return await createRepository();
};

export const list = async () => {
	return await listRepository();
};

export const update = async (id: string, room: RoomEntity) => {
	try {
		if (
			!room._id ||
			!room.capacity ||
			!room.cost ||
			!room.description ||
			room.disponibility == undefined ||
			!room.photo ||
			!room.type
		)
			throw Error("Missing room parameters");
		return await updateRepository(id, room);
	} catch (err) {
		throw err;
	}
};

export const updateAvailability = async (id: string, room: RoomEntity) => {
	try {
		if (room.disponibility == undefined)
			throw Error("Missing disponibility parameter");
		return await updateAvailabilityRepository(id, room);
	} catch (err) {
		throw err;
	}
};
