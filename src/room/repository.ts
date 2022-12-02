import { RoomSearch } from "../common/interfaces/room-search.interface";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { parseDynamoRecordToObject } from "../util/dynamo.util";
import { RoomEntity } from "../common/entities/room";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.ROOM_TABLE;

export const create = async () => {
	return "User created";
};

export const list = async () => {
	return "Listed rooms";
};

export const update = async () => {
	return "Room updated";
};

export const updateAvailability = async () => {
	return "Room availability updated";
};

export const findByType = async (
	roomTypes: RoomSearch[]
): Promise<RoomEntity[]> => {
	let availableRooms: RoomEntity[] = [];
	roomTypes.forEach(async (roomType) => {
		let responseDdb = await client.send(
			new ScanCommand({ TableName: TABLE_NAME })
		);
		if (!responseDdb.Items || responseDdb.Items.length < roomType.count)
			throw Error(`Not enough available rooms for type: ${roomType.type}`);

		let selectedRooms = responseDdb.Items.slice(0, roomType.count - 1);
		let parsedRooms: RoomEntity[] = parseDynamoRecordToObject(selectedRooms);
		availableRooms.concat(parsedRooms);
	});
	return availableRooms;
};
