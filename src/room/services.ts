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

export const update = async () => {
	return await updateRepository();
};

export const updateAvailability = async () => {
	return await updateAvailabilityRepository();
};
