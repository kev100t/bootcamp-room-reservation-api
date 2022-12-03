import { RoomEntity } from "../common/entities/room";
import { RoomSearch } from "../common/interfaces/room-search.interface";
import {
	DynamoDBClient,
	ScanCommand,
	UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { parseDynamoRecordToObject } from "../util/dynamo.util";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.ROOM_TABLE;

export const create = async () => {
	return "User created";
};

export const list = async () => {
	return "Listed rooms";
};

export const update = async (id: string, room: RoomEntity) => {
	try {
		let response = await client.send(
			new UpdateItemCommand({
				// ConditionExpression: "attribute_exists(_id)",
				TableName: TABLE_NAME,
				Key: {
					_id: { S: id },
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
					":_capacity": { N: room.capacity.toString() },
					":_cost": { N: room.cost.toString() },
					":_description": { S: room.description },
					":_disponibility": { BOOL: room.disponibility },
					":_photo": { S: room.photo },
					":_type": { S: room.type },
				},
				ReturnValues: "UPDATED_NEW",
			})
		);
		return response;
	} catch (error) {
		throw error;
	}
};

export const updateAvailability = async (id: string, room: RoomEntity) => {
	try {
		let response = await client.send(
			new UpdateItemCommand({
				// ConditionExpression: "attribute_exists(_id)",
				TableName: TABLE_NAME,
				Key: {
					_id: { S: id },
				},
				UpdateExpression: "SET  #disponibility = :_disponibility",
				ExpressionAttributeNames: {
					"#disponibility": "disponibility",
				},
				ExpressionAttributeValues: {
					":_disponibility": { BOOL: room.disponibility },
				},
				ReturnValues: "UPDATED_NEW",
			})
		);
		return response;
	} catch (error) {
		throw error;
	}
};

export const findByType = async (
	roomType: RoomSearch
): Promise<RoomEntity[]> => {
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

	let selectedRooms = responseDdb.Items.slice(0, roomType.count);
	let parsedRooms: RoomEntity[] = parseDynamoRecordToObject(
		selectedRooms
	) as RoomEntity[];
	return parsedRooms;
};

export const findById = async (roomId: string): Promise<RoomEntity> => {
	let availableRoom: RoomEntity;
	let responseDdb = await client.send(
		new ScanCommand({
			TableName: TABLE_NAME,
			FilterExpression: "#disponibility = :disponibility AND #_id = :_id",
			ExpressionAttributeNames: {
				"#disponibility": "disponibility",
				"#_id": "_id",
			},
			ExpressionAttributeValues: {
				":disponibility": { BOOL: true },
				":_id": { S: roomId },
			},
		})
	);
	if (!responseDdb.Items || responseDdb.Items.length == 0)
		throw Error("Room is not available.");
	availableRoom = parseDynamoRecordToObject(responseDdb.Items)[0] as RoomEntity;
	return availableRoom;
};
