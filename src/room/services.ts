import { v4 as uuidv4 } from "uuid";
import { save as saveFile } from "../common/files/file";
import { RoomEntity } from "../common/entities/room";
import {
	create as createRepository,
	list as listRepository,
	update as updateRepository,
	updateAvailability as updateAvailabilityRepository,
} from "./repository";

export const create = async (file, body: any) => {
	const url = await saveFile(file.fieldname, file.contentType, file.content);

	const room: RoomEntity = {
		id: uuidv4(),
		type: body.type,
		photo: url,
		capacity: body.capacity,
		cost: body.cost,
		disponibility: body.disponibility,
		description: body.description,
	};

	await createRepository(room);

	return;
};

export const list = async () => {
	return await listRepository();
};

export const update = async (id: string, obj: string) => {
	return await updateRepository(id, JSON.parse(obj));
};

export const updateAvailability = async (id: string, body: any) => {
	return await updateAvailabilityRepository(id, JSON.parse(body));
};
