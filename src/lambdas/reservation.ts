import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RoomSearch } from "../interfaces/reservation.interface";
import { Room } from "../interfaces/room.inteface";
import { create as createService } from "../reservation/services";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		if (!event.body) throw Error("Request body missing");
		let requestJSON = JSON.parse(event.body);
		let requestedRoom: Room = requestJSON.room;
		let requestedTypes: RoomSearch[] = requestJSON.roomTypes;
		if (!requestedRoom || !requestedTypes || requestedTypes.length == 0)
			throw Error("Request room/room types missing");

		let response = await createService(
			requestJSON.user,
			requestedRoom,
			requestedTypes
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: response,
			}),
		};
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
