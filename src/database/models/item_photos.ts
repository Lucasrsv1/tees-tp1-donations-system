import { DataTypes, Model, Sequelize } from "sequelize";

import { Database } from ".";
import { DonationItems } from "./donation_items";

export class ItemPhotos extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file must call this method.
	 */
	static associate (models: Database) {
		ItemPhotos.belongsTo(models.DonationItems, { as: "donation", foreignKey: "idDonationItem" });
	}

	public idItemPhoto: number;
	public idDonationItem: number;
	public link: string;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date | null;

	// Propriedades oriundas das associações
	public donation?: DonationItems;
}

export function initItemPhotos (sequelize: Sequelize) {
	ItemPhotos.init({
		idItemPhoto: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		idDonationItem: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		link: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		paranoid: true,
		timestamps: true,
		underscored: true,
		modelName: "ItemPhotos",
		tableName: "item_photos"
	});

	return ItemPhotos;
}
