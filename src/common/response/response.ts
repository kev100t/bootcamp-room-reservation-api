import { CustomErrorEntity } from "../entities/custom-error";

export const set = async (code = 200, data) => {
	return {
		statusCode: code,
		body: JSON.stringify(data),
	};
};

export const setError = async (error: CustomErrorEntity) => {
	return {
		statusCode: error.status,
		body: JSON.stringify({
			mesage: error.message,
		}),
	};
};
