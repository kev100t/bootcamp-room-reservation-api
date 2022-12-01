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

export const update = async (id:string , obj:string) => {
	
	return await updateRepository(id,JSON.parse(obj));
};

export const updateAvailability = async (id:string,disponibility:boolean) => {
	return await updateAvailabilityRepository(id,JSON.parse(disponibility));
};
