import { CustomErrorEntity } from "../entities/custom-error";

export const set = (code = 500, message: string) => {
	const error: CustomErrorEntity = new Error(message);

	if (code) {
		error.status = code;
	}

	return error;
};
