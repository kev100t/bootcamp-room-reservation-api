import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";
import { RoomEntity } from "../common/entities/room";
import { UserEntity } from "../common/entities/user";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.RESERVATION_TABLE;

export const create = async (user: UserEntity, reservedRooms: RoomEntity[]) => {
	let roomIds = reservedRooms.map((room) => room.id);
	let response = await client.send(
		new PutItemCommand({
			ConditionExpression: "attribute_not_exists(id)",
			TableName: TABLE_NAME,
			Item: {
				id: { S: ulid() },
				haabitaciones: { SS: roomIds },
				usuario: { S: user.id },
				fecha: { S: new Date().toTimeString() },
			},
		})
	);
};
