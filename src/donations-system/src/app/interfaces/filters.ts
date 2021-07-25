import { IItemType } from "./item-type";

export interface IFilters {
	search: string;
	itemTypes: IItemType[];
}
