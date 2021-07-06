"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("donation_items", {
			id_donation_item: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			id_user: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "users", key: "id_user" }
			},
			id_item_type: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "item_types", key: "id_item_type" }
			},
			description: {
				type: Sequelize.STRING,
				allowNull: false
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			state: {
				type: Sequelize.CHAR(2),
				allowNull: false
			},
			city: {
				type: Sequelize.STRING,
				allowNull: false
			},
			validation: {
				type: Sequelize.ENUM("APPROVED", "DENIED", "WAITING"),
				allowNull: false,
				defaultValue: "WAITING"
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
		await queryInterface.dropTable("donation_items");
	}
};
