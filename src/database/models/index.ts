import { Sequelize } from "sequelize";

import configs, { Environment } from "../config/config";
import { DonationItems, initDonationItems } from "./donation_items";
import { initItemPhotos, ItemPhotos } from "./item_photos";
import { initItemTypes, ItemTypes } from "./item_types";
import { initSolicitations, Solicitations } from "./solicitations";
import { initUsers, Users } from "./users";

export type Database = {
	sequelize: Sequelize,
	Sequelize: typeof Sequelize,
	DonationItems: typeof DonationItems,
	ItemPhotos: typeof ItemPhotos,
	ItemTypes: typeof ItemTypes,
	Solicitations: typeof Solicitations,
	Users: typeof Users
};

const env: Environment = (process.env.NODE_ENV as Environment) || "development";
const config = configs[env];

let sequelize: Sequelize;
if (process.env.FLASH_DATABASE)
	sequelize = new Sequelize(process.env.FLASH_DATABASE, config);
else
	sequelize = new Sequelize(config.database, config.username, config.password, config);

const db: Database = {
	sequelize,
	Sequelize,
	DonationItems: initDonationItems(sequelize),
	ItemPhotos: initItemPhotos(sequelize),
	ItemTypes: initItemTypes(sequelize),
	Solicitations: initSolicitations(sequelize),
	Users: initUsers(sequelize)
};

// Cria o relacionamento da tabelas
db.DonationItems.associate(db);
db.ItemPhotos.associate(db);
db.ItemTypes.associate(db);
db.Solicitations.associate(db);
db.Users.associate(db);

// Testa a conexão com o banco de dados
db.sequelize.authenticate()
	.then(_ => console.log("Database connected."))
	.catch(console.error);

export default db;
