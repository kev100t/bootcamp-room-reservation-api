import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { login as loginAuhtentication } from "../authentication/services";

export const login = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { email, password } = JSON.parse(event.body);

		const data = await loginAuhtentication(email, password);

		return {
			statusCode: 200,
			body: JSON.stringify(data),
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

export const checkAuthentication = async (event) => {
	return {
		principalId: "anonymous",
		policyDocument: {
			Version: "2012-10-17",
			Statement: [
				{
					Action: "execute-api:Invoke",
					Effect: "Allow",
					Resource: event.routeArn,
				},
			],
		},
	};
};
