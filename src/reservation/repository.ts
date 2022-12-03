import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";
import { CustomErrorEntity } from "../common/entities/custom-error";
import { ReservationEntity } from "../common/entities/reservation";
import { RoomEntity } from "../common/entities/room";
import { UserEntity } from "../common/entities/user";
import { parseObjectToDynamoRecord } from "../util/dynamo.util";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.RESERVATION_TABLE;

export const create = async (user: UserEntity, reservedRooms: RoomEntity[]) => {
	let roomIds = reservedRooms.map((room) => {
		return { _id: room._id } as RoomEntity;
	});
	let reservation: ReservationEntity = {
		date: new Date().toTimeString(),
		id: ulid(),
		rooms: roomIds,
		user: { id: user.id } as UserEntity,
	};
	try {
		let response = await client.send(
			new PutItemCommand({
				ConditionExpression: "attribute_not_exists(id)",
				TableName: TABLE_NAME,
				Item: parseObjectToDynamoRecord(reservation),
			})
		);
		return { response, reservation };
	} catch (err) {
		throw { message: "Reservation registry failed." } as CustomErrorEntity;
	}
};
