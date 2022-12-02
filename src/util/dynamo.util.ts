import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { convertToNative, unmarshall, marshall } from "@aws-sdk/util-dynamodb";

export const parseDynamoRecordToObject = (
	dynamoItems: Record<string, AttributeValue>[]
) => {
	const parsedItems = dynamoItems.map((dItem) => unmarshall(dItem));
	return parsedItems as object[];
};

export const parseObjectToDynamoRecord = (obj: object) => {
	const parsedItem = marshall(obj);
	return parsedItem;
};
