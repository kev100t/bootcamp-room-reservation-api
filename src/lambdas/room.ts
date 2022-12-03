import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parse as parseFile } from "lambda-multipart-parser";
import { RoomEntity } from "../common/entities/room";
import {
	updateAvailability as updateAvailabilityRoom,
	create as createRoom,
	list as listRoom,
	update as updateRoom,
} from "../room/services";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const body = await parseFile(event);

		const file = body.files[0];

		await createRoom(file, body);

		return await setResponse(200, {
			message: "Room created",
		});
	} catch (error) {
		return await setErrorResponse(error);
	}
};

export const list = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const data = await listRoom();

		return await setResponse(200, data);
	} catch (error) {
		return await setErrorResponse(error);
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
	} catch (error) {
		return await setErrorResponse(error);
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
	} catch (error) {
		return await setErrorResponse(error);
	}
};
