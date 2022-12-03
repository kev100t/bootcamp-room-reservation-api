import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { update as updateRoom } from "../room/services";
import { updateAvailability as updateAvailabilityRoom } from "../room/services";

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
		const body = event.body;
		let responce = await updateRoom(id, body);
		return {statusCode: 200,
					 	body: JSON.stringify({
							responce,
						}
			)}

	} catch (err) {
		console.log(err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error al actualizar Habitacion",
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
		let responce = await updateAvailabilityRoom(id, body);
		return {statusCode: 200,
			body: JSON.stringify({
			   responce,
		   }
		)}
		
	} catch (err) {
		console.log(err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error al actualizar disponibilidad",
			}),
		};
	}
};
