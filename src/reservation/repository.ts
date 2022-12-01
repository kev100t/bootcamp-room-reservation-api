import { Room } from "../interfaces/room.inteface";
import { User } from "../interfaces/user.interface";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.RESERVATIONS_TABLE;

export const create = async (user: User, reservedRooms: Room[]) => {
	let roomIds = reservedRooms.map((room) => room.id);
	let response = await client.send(
		new PutItemCommand({
			ConditionExpression: "attribute_not_exists(id)",
			TableName: TABLE_NAME,
			Item: {
				id: { S: uuid() },
				haabitaciones: { SS: roomIds },
				usuario: { S: user.id },
				fecha: { S: new Date().toTimeString() },
			},
		})
	);
};
