import { create as createRepository } from "./repository";
import { UserEntity } from "../common/entities/user";
import { RoleEnum } from "../common/enums/role";
import { ulid } from "ulid";
import * as bcrypt from "bcryptjs";

export const create = async (
	names: string,
	email: string,
	password: string
) => {
	const hash = await bcrypt.hash(password, 10);

	const user: UserEntity = {
		id: ulid(),
		names: names,
		email: email,
		password: hash,
		role: RoleEnum.REGULAR,
	};

	return await createRepository(user);
};
