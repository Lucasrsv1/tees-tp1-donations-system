import { DataTypes, Model, Sequelize } from "sequelize";

import { Database } from ".";
import { DonationItems } from "./donation_items";

export class ItemTypes extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file must call this method.
	 */
	static associate (models: Database) {
		ItemTypes.hasMany(models.DonationItems, { as: "donations", foreignKey: "idItemType" });
	}

	public idItemType: number;
	public name: string;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date | null;

	// Propriedades oriundas das associações
	public donations?: DonationItems[];
}

export function initItemTypes (sequelize: Sequelize) {
	ItemTypes.init({
		idItemType: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false
		}
	}, {
		sequelize,
		paranoid: true,
		timestamps: true,
		underscored: true,
		modelName: "ItemTypes",
		tableName: "item_types"
	});

	return ItemTypes;
}
