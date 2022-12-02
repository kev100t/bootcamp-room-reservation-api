import { RoomEntity } from "../common/entities/room";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import {
	DynamoDBClient,
	ScanCommand,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { parseDynamoRecordToObject } from "../util/dynamo.util";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.ROOM_TABLE;

export const create = async (body: any) => {
	const room: RoomEntity = {
		id: uuidv4(),
		type: body.type,
		photo: body.photo,
		capacity: body.capacity,
		cost: body.cost,
		disponibility: body.disponibility,
		description: body.description,
	};

	const params = {
		TableName: TABLE_NAME,
		Item: {
			_id: {
				S: room.id,
			},
			type: {
				S: room.type,
			},
			photo: {
				S: room.photo,
			},
			capacity: {
				N: `${room.capacity}`,
			},
			cost: {
				N: `${room.cost}`,
			},
			disponibility: {
				BOOL: room.disponibility,
			},
			description: {
				S: room.description,
			},
		},
	};
	try {
		const commmand = new PutItemCommand(params);
		const data = await client.send(commmand);
		console.log(data);
		return {
			statusCode: 200,
			body: JSON.stringify(room),
		};
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: e.message,
			}),
		};
	}
};

export const list = async () => {
	const params = {
		TableName: TABLE_NAME,
	};

	try {
		const command = new ScanCommand(params);
		const response = await client.send(command);

		const items = response.Items !== undefined ? response.Items : [];

		const rooms = items.map((item) => {
			const id: string = item._id.S ?? "";
			const type: string = item.type.S ?? "";
			const photo: string = item.photo.S ?? "";
			const capacity: string = item.capacity.N ?? "";
			const cost: string = item.cost.N ?? "";
			const disponibility: boolean = item.disponibility.BOOL ?? true;
			const description: string = item.description.S ?? "";

			return {
				id,
				type,
				photo,
				capacity: Number(capacity),
				cost: Number(cost),
				disponibility,
				description,
			};
		});

		return {
			statusCode: 200,
			body: JSON.stringify(rooms),
		};
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify("Error al obtener las habitaciones"),
		};
	}
};

export const update = async (id: string, obj: any) => {
	try {
		const AWS = require("aws-sdk");
		
		const dynamodb = new AWS.DynamoDB.DocumentClient();

		const params = {
			TableName: process.env.ROOM_TABLE,
			Key: {
				_id: id,
			},
			UpdateExpression:
				"SET  #capacity = :_capacity, #cost = :_cost, #description = :_description, #disponibility = :_disponibility, #photo = :_photo, #type = :_type",
			ExpressionAttributeNames: {
				"#capacity": "capacity",
				"#cost": "cost",
				"#description": "description",
				"#disponibility": "disponibility",
				"#photo": "photo",
				"#type": "type",
			},
			ExpressionAttributeValues: {
				":_capacity": obj.capacity,
				":_cost": obj.cost,
				":_description": obj.description,
				":_disponibility": obj.disponibility,
				":_photo": obj.photo,
				":_type": obj.type,
			},
			ReturnValues: "UPDATED_NEW",
		};
		console.log("params", params);

		return new Promise((resolve) =>
			dynamodb.update(params, (err: any, data: any) => {
				if (err) {
					console.error("No actualizó correctamente", err);
					resolve({
						statusCode: 500,
						body: JSON.stringify({
							message: err,
						}),
					});
				} else {
					console.log("Actualizó correctamente", data);
					resolve({
						statusCode: 200,
						body: JSON.stringify({
							data,
						}),
					});
				}
			})
		);
	} catch (error) {
		console.log("error catch", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error al actualizar habitacion",
			}),
		};
	}
};

export const updateAvailability = async (
	id: string,
	body: { disponibility: boolean }
) => {
	try {
		const AWS = require("aws-sdk");

		const dynamodb = new AWS.DynamoDB.DocumentClient();

		const params = {
			TableName: process.env.ROOM_TABLE,
			Key: {
				_id: id,
			},
			UpdateExpression: "SET   #disponibility = :_disponibility",
			ExpressionAttributeNames: {
				"#disponibility": "disponibility",
			},
			ExpressionAttributeValues: {
				":_disponibility": body.disponibility,
			},
			ReturnValues: "UPDATED_NEW",
		};
		console.log("params", params);

		return new Promise((resolve) =>
			dynamodb.update(params, (err: any, data: any) => {
				if (err) {
					console.error("No actualizó correctamente", err);
					resolve({
						statusCode: 500,
						body: JSON.stringify({
							message: err,
						}),
					});
				} else {
					console.log("Actualizó correctamente", data);
					resolve({
						statusCode: 200,
						body: JSON.stringify({
							data,
						}),
					});
				}
			})
		);
	} catch (error) {
		console.log("error catch", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error al actualizar habitacion",
			}),
		};
	}
};

export const findByType = async (
	roomTypes: RoomSearch[]
): Promise<RoomEntity[]> => {
	let availableRooms: RoomEntity[] = [];
	roomTypes.forEach(async (roomType) => {
		let responseDdb = await client.send(
			new ScanCommand({
				TableName: TABLE_NAME,
				FilterExpression: "#disponibility = :disponibility AND #type = :type",
				ExpressionAttributeNames: {
					"#disponibility": "disponibility",
					"#type": "type",
				},
				ExpressionAttributeValues: {
					":disponibility": { BOOL: true },
					":type": { S: roomType.type },
				},
			})
		);
		if (!responseDdb.Items || responseDdb.Items.length < roomType.count)
			throw Error(`Not enough available rooms for type: ${roomType.type}`);

		let selectedRooms = responseDdb.Items.slice(0, roomType.count - 1);
		let parsedRooms: RoomEntity[] = parseDynamoRecordToObject(selectedRooms);
		availableRooms.concat(parsedRooms);
	});
	return availableRooms;
};
