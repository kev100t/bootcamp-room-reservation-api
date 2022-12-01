export const create = async () => {
	return "User created";
};

export const list = async () => {
	return "Listed rooms";
};

export const update = async (id: string, obj: any) => {
	try {
		const AWS = require("aws-sdk");

		const dynamodb = new AWS.DynamoDB.DocumentClient();

		const params = {
			TableName: "rooms",
			Key: {
				_id: id,
			},
			UpdateExpression:
				"SET  #capacity = :_capacity, #cost = :_cost, #description = :_description, #disponibility = :_disponibility, #photo = :_photo, #type = :_type",
			ExpressionAttributeNames: {
				"#capacity": "capacity",
				"#cost": "cost",
				"#description": "description",
				"#disponibility": "disponibility",
				"#photo": "photo",
				"#type": "type",
			},
			ExpressionAttributeValues: {
				":_capacity": obj.capacity,
				":_cost": obj.cost,
				":_description": obj.description,
				":_disponibility": obj.disponibility,
				":_photo": obj.photo,
				":_type": obj.type,
			},
			ReturnValues: "UPDATED_NEW",
		};
		console.log("params", params);

		return new Promise((resolve) =>
			dynamodb.update(params, (err: any, data: any) => {
				if (err) {
					console.error("No actualizó correctamente", err);
					resolve({
						statusCode: 500,
						body: JSON.stringify({
							message: err,
						}),
					});
				} else {
					console.log("Actualizó correctamente", data);
					resolve({
						statusCode: 200,
						body: JSON.stringify({
							message: "Registro Actualizado",
						}),
					});
				}
			})
		);
	} catch (error) {
		console.log("error catch", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error al actualizar habitacion",
			}),
		};
	}
};

export const updateAvailability = async (id: string, body: boolean) => {
	try {
		const AWS = require("aws-sdk");

		const dynamodb = new AWS.DynamoDB.DocumentClient();

		const params = {
			TableName: "rooms",
			Key: {
				_id: id,
			},
			UpdateExpression:
				"SET   #disponibility = :_disponibility",
			ExpressionAttributeNames: {				
				"#disponibility": "disponibility"
				
			},
			ExpressionAttributeValues: {
				
				":_disponibility": body.disponibility
				
			},
			ReturnValues: "UPDATED_NEW",
		};
		console.log("params", params);

		return new Promise((resolve) =>
			dynamodb.update(params, (err: any, data: any) => {
				if (err) {
					console.error("No actualizó correctamente", err);
					resolve({
						statusCode: 500,
						body: JSON.stringify({
							message: err,
						}),
					});
				} else {
					console.log("Actualizó correctamente", data);
					resolve({
						statusCode: 200,
						body: JSON.stringify({
							message: "Registro Actualizado",
						}),
					});
				}
			})
		);
	} catch (error) {
		console.log("error catch", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error al actualizar habitacion",
			}),
		};
	}
};
