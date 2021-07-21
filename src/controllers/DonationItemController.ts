import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { DonationItems } from "../database/models/donation_items";
import { ItemTypes } from "../database/models/item_types";
import { Users } from "../database/models/users";

class DonationItemController {

	constructor () { }

	public static async getAllItems (req: Request, res: Response) {
		try {
			const allItems = await db.DonationItems.findAll({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city"]
			});
			return res.status(200).json(allItems);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async getAllItemsOfUser (req: Request, res: Response) {
		const { idUser } = req.params;
		try {
			const allItems = await db.DonationItems.findAll({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city"],
				where: { idUser: Number(idUser) }
			});
			return res.status(200).json(allItems);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async getItemOfUserById (req: Request, res: Response) {
		const { idUser, idDonationItem } = req.params;
		try {
			const item = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city"],
				where: { idUser: Number(idUser), idDonationItem: Number(idDonationItem) }
			});
			return res.status(200).json(item);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async createDonationItem (req: Request, res: Response) {
		const { idUser } = req.params;
		const newDonationItem = { ...req.body, idUser: Number(idUser) };
		try {
			const newDonationItemCreated = (await db.DonationItems.create(newDonationItem)).toJSON() as Partial<DonationItems>;
			return res.status(200).json(newDonationItemCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Este item já está cadastrado." });

			res.status(500).json(err.message);
		}
	}

	public static get createUserValidations (): ValidationChain[]  {
		return [
			body("idUser").isIn([Users]).withMessage("Usuario invalido."),
			body("idItemType").isIn([ItemTypes]).withMessage("Tipo de item invalido."),
			body("description").isString().withMessage("Descricao inválida."),
			body("quantity").isString().withMessage("Quantidade invalida."),
			body("state").isString().withMessage("Estado invalida."),
			body("city").isString().withMessage("Cidade invalida.")
		];
	}

	public static async updateDonationItem (req: Request, res: Response) {
		const { idUser, idDonationItem } = req.params;
		const newInfo = req.body;
		try {
			await db.DonationItems.update(newInfo, { where: { idUser: Number(idUser), idDonationItem: Number(idDonationItem) } });
			const updatedUser = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city"],
				where: { idUser: Number(idUser), idDonationItem: Number(idDonationItem) }
			});
			return res.status(200).json(updatedUser);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async deleteDonationItem (req: Request, res: Response) {
		const { idUser, idDonationItem } = req.params;

		/*
		const authDonationItem = res.locals.item as Partial<DonationItems>;
		if (authDonationItem.idUser != Number(idUser))
			return res.status(403).json({ message: "Você não pode deletar um item de outra pessoa, apenas o seu próprio!" });
		*/

		try {
			await db.DonationItems.destroy({ where: { idDonationItem: Number(idDonationItem) } });
			return res.status(200).json({ message: `Item de ID ${idDonationItem} deletado.` });
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}
}

export default DonationItemController;
