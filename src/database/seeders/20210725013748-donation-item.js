"use strict";

const donationItems = [{
	id_donation_item: 1,
	id_user: 1,
	id_item_type: 1,
	description: "Pacote de cimento, 50kg",
	quantity: 2,
	state: "MG",
	city: "Belo Horizonte"
}];

const photos = [
	{ id_donation_item: 1, link: "20210724224930358.png" },
	{ id_donation_item: 1, link: "20210724225154876.jpg" }
];

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("donation_items", donationItems);
		await queryInterface.bulkInsert("item_photos", photos);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("donation_items", {
			id_donation_item: donationItems.map(dI => dI.id_donation_item)
		});
		await queryInterface.bulkDelete("donation_items", {
			[Sequelize.Op.or]: photos
		});
	}
};
