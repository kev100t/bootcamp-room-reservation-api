import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RoomEntity } from "../common/entities/room";
import { update as updateRoom } from "../room/services";
import { updateAvailability as updateAvailabilityRoom } from "../room/services";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";
import { CustomErrorEntity } from "../common/entities/custom-error";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Room created",
			}),
		};
	} catch (err) {
		console.log(err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "some error happened",
			}),
		};
	}
};

export const list = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Listed rooms",
			}),
		};
	} catch (err) {
		console.log(err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "some error happened",
			}),
		};
	}
};

export const update = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const id = event.pathParameters.id;
		if (!event.body) throw Error("Request body missing");
		let requestJSON: RoomEntity = JSON.parse(event.body);
		let response = await updateRoom(id, requestJSON);
		return await setResponse(201, response);
	} catch (err) {
		console.log(err);
		return await setErrorResponse(err as CustomErrorEntity);
	}
};

export const updateAvailability = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const id = event.pathParameters.id;
		if (!event.body) throw Error("Request body missing");
		let requestJSON: RoomEntity = JSON.parse(event.body);
		let response = await updateAvailabilityRoom(id, requestJSON);
		return await setResponse(201, response);
	} catch (err) {
		console.log(err);
		return await setErrorResponse(err as CustomErrorEntity);
	}
};
