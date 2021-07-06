"use strict";

const itemTypes = [
	{ name: "Material de Construção" },
	{ name: "Mobília" },
	{ name: "Roupa de Cama" },
	{ name: "Utensílios Domésticos" },
	{ name: "Vestuário" }
];

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("item_types", itemTypes);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("item_types", {
			name: itemTypes.map(i => i.name)
		});
	}
};
