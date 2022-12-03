import { RoomEntity } from "../common/entities/room";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { parseDynamoRecordToObject } from "../util/dynamo.util";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.ROOM_TABLE;

export const create = async () => {
	return "User created";
};

export const list = async () => {
	return "Listed rooms";
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
		// console.log("params", params);

		return new Promise((resolve) =>
			dynamodb.update(params, (err: any, data: any) => {
				if (err) {
					// console.error("No actualizó correctamente", err);
					throw err;
				} else {
					return data;
					// console.log("Actualizó correctamente", data);
					// resolve({
					// 	statusCode: 200,
					// 	body: JSON.stringify({
					// 		data,
					// 	}),
					// });
				}
			})
		);
	} catch (error) {
		throw error;
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
		// console.log("params", params);

		return new Promise((resolve) =>
			dynamodb.update(params, (err: any, data: any) => {
				if (err) {
					throw err;
					// console.error("No actualizó correctamente", err);
					// resolve({
					// 	statusCode: 500,
					// 	body: JSON.stringify({
					// 		message: err,
					// 	}),
					// });
				} else {
					return data;
					// console.log("Actualizó correctamente", data);
					// resolve({
					// 	statusCode: 200,
					// 	body: JSON.stringify({
					// 		data,
					// 	}),
					// });
				}
			})
		);
	} catch (error) {
		throw error;
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
