import { RoleEnum } from "../enum/role";

export interface UserEntity {
	id: string;
	names: string;
	email: string;
	password: string;
	role: RoleEnum;
}
