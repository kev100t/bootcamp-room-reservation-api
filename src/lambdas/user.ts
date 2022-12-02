import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { create as createUser } from "../user/services";
import { set as setError } from "../common/error/error";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { names, email, password } = JSON.parse(event.body);

		if (!names) {
			throw setError(400, "Names not send");
		}

		if (!email) {
			throw setError(400, "Email not send");
		}

		if (!password) {
			throw setError(400, "Password not send");
		}

		await createUser(names, email, password);

		return await setResponse(200, {
			message: "User created",
		});
	} catch (error) {
		return await setErrorResponse(error);
	}
};
