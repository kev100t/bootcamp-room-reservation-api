import { RoomSearch } from "../interfaces/reservation.interface";
import { Room } from "../interfaces/room.inteface";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { parseDynamoRecordToObject } from "../util/dynamo.util";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.ROOMS_TABLE;

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

export const findByType = async (roomTypes: RoomSearch[]): Promise<Room[]> => {
	let availableRooms: Room[] = [];
	roomTypes.forEach(async (roomType) => {
		let responseDdb = await client.send(
			new ScanCommand({ TableName: TABLE_NAME })
		);
		if (!responseDdb.Items || responseDdb.Items.length < roomType.count)
			throw Error(`Not enough available rooms for type: ${roomType.type}`);

		let selectedRooms = responseDdb.Items.slice(0, roomType.count - 1);
		let parsedRooms: Room[] = parseDynamoRecordToObject(selectedRooms);
		availableRooms.concat(parsedRooms);
	});
	return availableRooms;
};
