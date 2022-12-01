import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UserEntity } from "../common/entities/user";

const dynamodb = new DynamoDB({});

export const create = async (user: UserEntity) => {
	const product = {
		id: {
			S: user.id,
		},
		names: {
			S: user.names,
		},
		email: {
			S: user.email,
		},
		password: {
			S: user.password,
		},
		role: {
			S: user.role,
		},
	};

	const params = {
		TableName: process.env.USER_TABLE,
		Item: product,
	};

	return await dynamodb.putItem(params);
};
