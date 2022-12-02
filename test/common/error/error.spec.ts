import { set } from "../../../src/common/error/error";

describe("@Set", () => {
	it("#Should returns a status and message when passed", async () => {
		const status = 401;
		const message = "Message test";

		const error = await set(status, message);

		expect(status).toEqual(error.status);
		expect(message).toEqual(error.message);
	});

	it("#Should returns a default status 500 when it's not passed", async () => {
		const defaultStatus = 500;
		const status = undefined;
		const message = "Message test";

		const error = await set(status, message);

		expect(defaultStatus).toEqual(error.status);
		expect(message).toEqual(error.message);
	});
});
