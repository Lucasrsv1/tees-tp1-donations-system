import { IUser } from "./user";

export enum Validation {
	APPROVED = "APPROVED",
	DENIED = "DENIED",
	WAITING = "WAITING"
}

export interface ISolicitation {
	idSolicitation: number;
	idUser: number;
	idDonationItem: number;
	justification: string;
	validation: Validation;
	user: IUser;
}
