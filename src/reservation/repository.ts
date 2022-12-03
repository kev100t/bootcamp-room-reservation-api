import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";
import { CustomErrorEntity } from "../common/entities/custom-error";
import { ReservationEntity } from "../common/entities/reservation";
import { RoomEntity } from "../common/entities/room";
import { parseObjectToDynamoRecord } from "../util/dynamo.util";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.RESERVATION_TABLE;

export const create = async (userId: string, reservedRooms: RoomEntity[]) => {
	const roomIds = reservedRooms.map((room) => {
		return { _id: room._id } as RoomEntity;
	});

	const reservation: ReservationEntity = {
		date: new Date().toTimeString(),
		id: ulid(),
		rooms: roomIds,
		userId,
	};

	const reservationDbd = parseObjectToDynamoRecord(reservation);

	await client.send(
		new UpdateItemCommand({
			ConditionExpression: "attribute_not_exists(id)",
			TableName: TABLE_NAME,
			Key: {
				id: { S: ulid() },
			},
			UpdateExpression:
				"SET  #date = :_date, #rooms = :_rooms, #userId = :_userId",
			ExpressionAttributeNames: {
				"#date": "date",
				"#rooms": "rooms",
				"#userId": "userId",
			},
			ExpressionAttributeValues: {
				":_date": reservationDbd.date,
				":_rooms": reservationDbd.rooms,
				":_userId": reservationDbd.userId,
			},
			ReturnValues: "UPDATED_NEW",
		})
	);

	return;
};
