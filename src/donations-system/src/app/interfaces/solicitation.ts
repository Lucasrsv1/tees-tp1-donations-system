export enum Validation {
	APPROVED = "APPROVED",
	DENIED = "DENIED",
	WAITING = "WAITING"
}

export interface ISolicitation {
	idSolicitation: number;
	idUser: number;
	idDonationItem: number;
	reason: string;
	validation: Validation;
}
