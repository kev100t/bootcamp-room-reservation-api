import { searchUser as searchUserRepository } from "./repository";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

export const login = async (email: string, password: string) => {
	const users = await searchUserRepository(email);

	if (users.length == 0) {
		throw new Error("No autorizado");
	}

	const { password: userPassword, ...rest } = users[0];

	const samePassword = bcrypt.compareSync(password, userPassword);

	if (!samePassword) {
		throw new Error("No autorizado");
	}

	return {
		token: jwt.sign(rest, process.env.PRIVATE_KEY),
	};
};
