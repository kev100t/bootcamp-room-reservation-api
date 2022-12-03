import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { create as createService } from "../reservation/services";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";
import { set as setError } from "../common/error/error";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { userId } = event.requestContext.authorizer;
		const { roomId, rooms } = JSON.parse(event.body);

		if (!roomId && (!rooms || rooms.length == 0)) {
			throw setError(400, "Request roomId/rooms missing");
		}

		await createService(userId, roomId, rooms);

		return await setResponse(201, {
			message: "Reserved room(s)",
		});
	} catch (error) {
		return await setErrorResponse(error);
	}
};
