import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RoomEntity } from "../common/entities/room";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import { create as createService } from "../reservation/services";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		if (!event.body) throw Error("Request body missing");
		let requestJSON = JSON.parse(event.body);
		let requestedRoom: RoomEntity = requestJSON.room;
		let requestedTypes: RoomSearch[] = requestJSON.roomTypes;
		if (!requestedRoom || !requestedTypes || requestedTypes.length == 0)
			throw Error("Request room/room types missing");

		let data = await createService(
			requestJSON.user,
			requestedRoom,
			requestedTypes
		);

		return await setResponse(200, data);
	} catch (err: any) {
		console.log(err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: err.message,
			}),
		};
	}
};
