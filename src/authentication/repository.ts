import { DynamoDB, ItemResponse } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDB({});

export const searchUser = async (email: string) => {
	const users: ItemResponse[] = [];

	const params = {
		TableName: process.env.USER_TABLE,
		ExpressionAttributeValues: {
			":email": {
				S: email,
			},
		},
		FilterExpression: "email = :email",
	};

	const { Items: items } = await dynamodb.scan(params);

	if (items.length > 0) {
		for (const item of items) {
			users.push({
				id: item.id.S,
				email: item.email.S,
				password: item.password.S,
				role: item.role.S,
				names: item.names.S,
			});
		}

		return users;
	}

	return users;
};
