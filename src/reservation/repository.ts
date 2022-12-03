import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
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
	let reservationDbd = parseObjectToDynamoRecord(reservation);
	try {
		let response = await client.send(
			new UpdateItemCommand({
				ConditionExpression: "attribute_not_exists(id)",
				TableName: TABLE_NAME,
				Key: {
					id: { S: ulid() },
				},
				UpdateExpression:
					"SET  #date = :_date, #rooms = :_rooms, #user = :_user",
				ExpressionAttributeNames: {
					"#date": "date",
					"#rooms": "rooms",
					"#user": "user",
				},
				ExpressionAttributeValues: {
					":_date": reservationDbd.date,
					":_rooms": reservationDbd.rooms,
					":_user": reservationDbd.user,
				},
				ReturnValues: "UPDATED_NEW",
			})
		);
		return response;
	} catch (err) {
		throw {
			message: `Reservation registry failed: ${err.message}`,
		} as CustomErrorEntity;
	}
};
