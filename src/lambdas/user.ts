import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { create as createUser } from "../user/services";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { names, email, password } = JSON.parse(event.body);

		const data = await createUser(names, email, password);

		return await setResponse(200, data);
	} catch (error) {
		return await setErrorResponse(error);
	}
};
