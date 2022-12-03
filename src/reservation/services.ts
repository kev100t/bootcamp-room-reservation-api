import { RoomEntity } from "../common/entities/room";
import { UserEntity } from "../common/entities/user";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import { create as createRepository } from "./repository";
import {
	updateAvailability as updateRoomRepository,
	findByType as findByTypeRepository,
	findById as findByIdRepository,
} from "../room/repository";
import { CustomErrorEntity } from "../common/entities/custom-error";

export const create = async (
	user: UserEntity,
	room?: RoomEntity,
	roomTypes?: RoomSearch[]
) => {
	try {
		let reservedRooms: RoomEntity[] = [];
		if (room) reservedRooms = [await findByIdRepository(room._id)];
		else if (roomTypes) {
			for await (const roomType of roomTypes) {
				reservedRooms = reservedRooms.concat(
					await findByTypeRepository(roomType)
				);
			}
		} else throw { message: "Request parameters missing" } as CustomErrorEntity;
		const reservation = await createRepository(user, reservedRooms);
		for await (const reservedRoom of reservedRooms) {
			await updateRoomRepository(reservedRoom._id, {
				disponibility: false,
			} as RoomEntity);
		}
		return reservation;
	} catch (err) {
		throw err;
	}
};
