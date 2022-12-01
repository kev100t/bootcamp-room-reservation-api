import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayTokenAuthorizerEvent,
	APIGatewayAuthorizerResult,
} from "aws-lambda";
import { login as loginAuhtentication } from "../authentication/services";
import {
	set as setResponse,
	setError as setErrorResponse,
} from "../common/response/response";
import * as jsonwebtoken from "jsonwebtoken";

export const login = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const { email, password } = JSON.parse(event.body);

		const data = await loginAuhtentication(email, password);

		return await setResponse(200, data);
	} catch (error) {
		return await setErrorResponse(error);
	}
};

export const checkAuthentication = async (
	event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
	const { authorizationToken, methodArn } = event;

	try {
		const tokenParts = authorizationToken.split(" ");

		const token = tokenParts[1];

		const { userId } = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);

		const context = {
			userId,
		};

		return await generateAuthResponse(userId, "Allow", methodArn, context);
	} catch (error) {
		return await generateAuthResponse("userId", "Deny", methodArn, null);
	}
};

const generateAuthResponse = async (
	principalId: string,
	effect: string,
	methodArn: string,
	context: any
) => {
	const policyDocument = await generatePolicyDocument(effect, methodArn);

	return {
		principalId,
		policyDocument,
		context,
	};
};

const generatePolicyDocument = async (effect: string, methodArn: string) => {
	if (!effect || !methodArn) return null;

	const policyDocument = {
		Version: "2012-10-17",
		Statement: [
			{
				Action: "execute-api:Invoke",
				Effect: effect,
				Resource: methodArn,
			},
		],
	};

	return policyDocument;
};
