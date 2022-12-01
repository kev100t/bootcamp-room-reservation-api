import { CustomErrorEntity } from "../entities/custom-error";

export const set = (code: number, message: string) => {
	const error: CustomErrorEntity = new Error(message);

	if (code) {
		error.status = code || 500;
	}

	return error;
};
