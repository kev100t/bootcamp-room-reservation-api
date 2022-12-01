import { RoleEnum } from "../enums/role";

export interface UserEntity {
	id: string;
	names: string;
	email: string;
	password: string;
	role: RoleEnum;
}
