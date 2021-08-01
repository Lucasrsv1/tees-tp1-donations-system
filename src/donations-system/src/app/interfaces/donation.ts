import { IItemType } from "./item-type";
import { IPhoto } from "./photo";
import { ISolicitation, Validation } from "./solicitation";
import { IUser } from "./user";

export interface IDonation {
	idDonationItem: number;
	idUser: number;
	idItemType: number;
	description: string;
	quantity: number;
	state: string;
	city: string;
	validation: Validation;
	itemType: IItemType;
	donator: IUser;
	photos: IPhoto[];
	createdAt: Date;
	solicitations?: ISolicitation[];
}
