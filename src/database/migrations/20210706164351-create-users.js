"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("users", {
			id_user: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING(256),
				allowNull: false
			},
			email: {
				type: Sequelize.STRING(256),
				allowNull: false,
				unique: true
			},
			password: {
				type: Sequelize.STRING(256),
				allowNull: false
			},
			type: {
				type: Sequelize.ENUM("PF", "PJ", "ADM"),
				allowNull: false
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW")
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW")
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true
			}
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("users");
	}
};
