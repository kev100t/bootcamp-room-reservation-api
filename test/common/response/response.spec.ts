import { set, setError } from "../../../src/common/response/response";
import { set as setErrorTest } from "../../../src/common/error/error";

describe("@Set", () => {
	it("#Should returns an object with status and data when passed", async () => {
		const code = 210;
		const data = { message: "Message test" };

		const response = await set(code, data);

		expect(response.statusCode).toEqual(code);
		expect(response.body).toEqual(JSON.stringify(data));
	});

	it("#Should returns an object with default status 200 when it isn't passed", async () => {
		const defaultStatus = 200;
		const code = undefined;
		const data = { message: "Message test" };

		const response = await set(code, data);

		expect(response.statusCode).toEqual(defaultStatus);
		expect(response.body).toEqual(JSON.stringify(data));
	});
});

describe("@setError", () => {
	it("#Should returns an object with status and data when passed", async () => {
		const status = 401;
		const message = "Message test";

		const error = await setErrorTest(status, message);

		const response = await setError(error);

		expect(response.statusCode).toEqual(error.status);
		expect(response.body).toEqual(
			JSON.stringify({
				mesage: error.message,
			})
		);
	});

	it("#Should returns an object with default status 500 when it isn't passed ", async () => {
		const defaultStatus = 500;
		const status = undefined;
		const message = "Message test";

		const error = await setErrorTest(status, message);

		const response = await setError(error);

		expect(response.statusCode).toEqual(defaultStatus);
		expect(response.body).toEqual(
			JSON.stringify({
				mesage: error.message,
			})
		);
	});
});
