import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { create as createService } from "../reservation/services";
import { RoomEntity } from "../common/entities/room";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";
import { set as setError } from "../common/error/error";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		if (!event.body) throw setError(400, "Request body missing");

		const requestJSON = JSON.parse(event.body);
		const requestedRoom: RoomEntity = requestJSON.room;
		const requestedTypes: RoomSearch[] = requestJSON.roomTypes;

		if (!requestJSON.user) throw setError(400, "Request user missing");
		if (!requestedRoom && (!requestedTypes || requestedTypes.length == 0))
			throw setError(400, "Request room/room types missing");

		const data = await createService(
			requestJSON.user,
			requestedRoom,
			requestedTypes
		);

		return await setResponse(201, data);
	} catch (error) {
		return await setErrorResponse(error);
	}
};
