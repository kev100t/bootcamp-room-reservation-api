import * as jsonwebtoken from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { searchUser as searchUserRepository } from "./repository";
import { set as setError } from "../common/error/error";

export const login = async (email: string, password: string) => {
	const users = await searchUserRepository(email);

	if (users.length == 0) {
		throw setError(401, "Email doesn't exist");
	}

	const user = users[0];

	const samePassword = bcrypt.compareSync(password, user.password);

	if (!samePassword) {
		throw setError(401, "Incorrect password");
	}

	return {
		token: jsonwebtoken.sign(
			{ userId: user.id, role: user.role },
			process.env.PRIVATE_KEY
		),
	};
};
