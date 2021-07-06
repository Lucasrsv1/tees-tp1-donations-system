import { DataTypes, Model, Sequelize } from "sequelize";

import { Database } from ".";
import { ItemPhotos } from "./item_photos";
import { ItemTypes } from "./item_types";
import { Solicitations } from "./solicitations";
import { Users } from "./users";

export enum Validation {
	APPROVED = "APPROVED",
	DENIED = "DENIED",
	WAITING = "WAITING"
}

export class DonationItems extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file must call this method.
	 */
	static associate (models: Database) {
		DonationItems.belongsTo(models.Users, { as: "donator", foreignKey: "idUser" });
		DonationItems.belongsTo(models.ItemTypes, { as: "itemType", foreignKey: "idItemType" });

		DonationItems.hasMany(models.ItemPhotos, { as: "photos", foreignKey: "idDonationItem" });
		DonationItems.hasMany(models.Solicitations, { as: "solicitations", foreignKey: "idDonationItem" });
	}

	public idDonationItem: number;
	public idUser: number;
	public idItemType: number;
	public description: string;
	public quantity: number;
	public state: string;
	public city: string;
	public validation: Validation;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date | null;

	// Propriedades oriundas das associações
	public donator?: Users;
	public itemType?: ItemTypes;
	public photos?: ItemPhotos[];
	public solicitations?: Solicitations[];
}

export function initDonationItems (sequelize: Sequelize) {
	DonationItems.init({
		idDonationItem: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		idUser: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		idItemType: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		state: {
			type: DataTypes.CHAR(2),
			allowNull: false
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false
		},
		validation: {
			type: DataTypes.ENUM(Validation.APPROVED, Validation.DENIED, Validation.WAITING),
			allowNull: false,
			defaultValue: Validation.WAITING
		}
	}, {
		sequelize,
		paranoid: true,
		timestamps: true,
		underscored: true,
		modelName: "DonationItems",
		tableName: "donation_items"
	});

	return DonationItems;
}
