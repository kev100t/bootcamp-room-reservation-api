import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { update as updateRoom } from "../room/services";
import { 
	updateAvailability as updateAvailabilityRoom, 
	create as createRoom,
	list as listRoom,
} from "../room/services";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

	const { body } = event
	try {
		return await createRoom(body)
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
	return await listRoom()
};

export const update = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const id = event.pathParameters.id;
		const body = event.body;
		return await updateRoom(id, body);
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

export const updateAvailability = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const id = event.pathParameters.id;
		const body = event.body;
		return await updateAvailabilityRoom(id, body);
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
