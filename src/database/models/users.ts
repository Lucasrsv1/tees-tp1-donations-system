import { DataTypes, Model, Sequelize } from "sequelize";

import { Database } from ".";
import { DonationItems } from "./donation_items";
import { Solicitations } from "./solicitations";

export enum UserType {
	ADM = "ADM",
	PF = "PF",
	PJ = "PJ"
}

export class Users extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file must call this method.
	 */
	static associate (models: Database) {
		Users.hasMany(models.DonationItems, { as: "donations", foreignKey: "idUser" });
		Users.hasMany(models.Solicitations, { as: "solicitations", foreignKey: "idUser" });
	}

	public idUser: number;
	public name: string;
	public email: string;
	public password: string;
	public type: UserType;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date | null;

	// Propriedades oriundas das associações
	public donations?: DonationItems[];
	public solicitations?: Solicitations[];
}

export function initUsers (sequelize: Sequelize) {
	Users.init({
		idUser: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(256),
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM(UserType.ADM, UserType.PF, UserType.PJ),
			allowNull: false
		}
	}, {
		sequelize,
		paranoid: true,
		timestamps: true,
		underscored: true,
		modelName: "Users",
		tableName: "users"
	});

	return Users;
}
