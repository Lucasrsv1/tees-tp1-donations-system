export enum UserType {
	ADM = "ADM",
	PF = "PF",
	PJ = "PJ"
}

export interface IUser {
	idUser?: number;
	name: string;
	email: string;
	password?: string;
	type: UserType;
}
