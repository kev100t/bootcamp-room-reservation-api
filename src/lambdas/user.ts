import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { create as createUser } from "../user/services";

export const create = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { names, email, password } = JSON.parse(event.body);

		const data = await createUser(names, email, password);

		return {
			statusCode: 200,
			body: JSON.stringify({
				data,
			}),
		};
	} catch (err) {
		console.log(err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "some error happened",
			}),
		};
	}
};
