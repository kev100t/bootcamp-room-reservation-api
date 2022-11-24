import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const login = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "User logged in",
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

export const checkAuthentication = async (event) => {
	const methodArn = event.methodArn;

	try {
		return generateAuthResponse("user", "Allow", methodArn);
	} catch (err) {
		return generateAuthResponse("user", "Deny", methodArn);
	}
};

function generateAuthResponse(principalId, effect, methodArn) {
	const policyDocument = generatePolicyDocument(effect, methodArn);

	return {
		principalId,
		policyDocument,
	};
}

function generatePolicyDocument(effect, methodArn) {
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
}
