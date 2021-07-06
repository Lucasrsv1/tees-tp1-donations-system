"use strict";

// A senha é 123456
const users = [{
	id_user: 1,
	name: "Administrator",
	email: "adm@donations.com",
	password: "ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413",
	type: "ADM"
}];

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("users", users);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("users", {
			id_user: users.map(u => u.id_user)
		});
	}
};
