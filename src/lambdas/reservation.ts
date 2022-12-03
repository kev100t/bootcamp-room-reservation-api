import { RoomEntity } from "../common/entities/room";
import { CustomErrorEntity } from "../common/entities/custom-error";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";
import { create as createService } from "../reservation/services";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		if (!event.body) throw Error("Request body missing");
		let requestJSON = JSON.parse(event.body);
		let requestedRoom: RoomEntity = requestJSON.room;
		let requestedTypes: RoomSearch[] = requestJSON.roomTypes;
		if (!requestJSON.user)
			throw { message: "Request user missing" } as CustomErrorEntity;
		if (!requestedRoom && (!requestedTypes || requestedTypes.length == 0))
			throw { message: "Request room/room types missing" } as CustomErrorEntity;

		let data = await createService(
			requestJSON.user,
			requestedRoom,
			requestedTypes
		);

		return await setResponse(201, data);
	} catch (err) {
		console.log(err);
		return await setErrorResponse(err as CustomErrorEntity);
	}
};
