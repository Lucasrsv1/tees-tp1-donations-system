import { DataTypes, Model, Sequelize } from "sequelize";

import { Database } from ".";
import { DonationItems, Validation } from "./donation_items";
import { Users } from "./users";

export class Solicitations extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file must call this method.
	 */
	static associate (models: Database) {
		Solicitations.belongsTo(models.Users, { as: "user", foreignKey: "idUser" });
		Solicitations.belongsTo(models.DonationItems, { as: "donation", foreignKey: "idDonationItem" });
	}

	public idSolicitation: number;
	public idUser: number;
	public idDonationItem: number;
	public justification: string;
	public validation: Validation;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date | null;

	// Propriedades oriundas das associações
	public user?: Users;
	public donation?: DonationItems;
}

export function initSolicitations (sequelize: Sequelize) {
	Solicitations.init({
		idSolicitation: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		idUser: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		idDonationItem: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		justification: {
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
		modelName: "Solicitations",
		tableName: "solicitations"
	});

	return Solicitations;
}
