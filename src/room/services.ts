import {
	create as createRepository,
	list as listRepository,
	update as updateRepository,
	updateAvailability as updateAvailabilityRepository,
} from "./repository";

export const create = async (body: any) => {
	return await createRepository(body);
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
