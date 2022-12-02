import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { convertToNative, unmarshall } from "@aws-sdk/util-dynamodb";

export const parseDynamoRecordToObject = (
	dynamoItems: Record<string, AttributeValue>[]
) => {
	const parsedItem = dynamoItems.map((dItem) =>
		convertToNative(dItem.AttributeValue)
	);
	return parsedItem;
};
