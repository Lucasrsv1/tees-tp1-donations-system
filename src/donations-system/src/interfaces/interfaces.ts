
export enum UserType {
	ADM = "ADM",
	PF = "PF",
	PJ = "PJ"
}

export enum Validation {
	APPROVED = "APPROVED",
	DENIED = "DENIED",
	WAITING = "WAITING"
}

export interface IUser {
  idUser: number
  name: string
  email: string
  type: UserType
}

export interface ISolicitation {
  idSolicitation: number
  idUser: number
  idDonationItem: number
  reasin: string
  validation: Validation
}

export interface IDonation {
  idDonation: number
  idUser: number
  idItemType: number
  description: string
  quantity: number
  state: string
  city: string
  validation: Validation
  itemType: ItemType
  donator: IUser
  photos: IPhoto[]
  createdAt: Date
}

export interface IPhoto {
  idPhoto: number
  idDonation: number
  link: string
}

export interface ItemType {
  idItemType: number
  name: string
}

export interface IFilters {
  search: string
  itemTypes: ItemType[]
}
