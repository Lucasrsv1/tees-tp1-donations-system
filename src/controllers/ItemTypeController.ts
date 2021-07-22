import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { ItemTypes } from "../database/models/item_types";

class ItemTypeController {

	constructor () { }

	/* Mostra todos os tipos de itens */
	public static async getAllItemTypes (req: Request, res: Response) {
		try {
			const allUsers = await db.ItemTypes.findAll({
				attributes: ["idItemType", "name"]
			});
			return res.status(200).json(allUsers);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Mostra todos os tipos de itens de um certo tipo de item por id*/
	public static async getItemTypesById (req: Request, res: Response) {
		const { idItemType } = req.params;
		try {
			const allUsers = await db.ItemTypes.findAll({
				attributes: ["name"],
				where: { idItemType: Number(idItemType) }
			});
			return res.status(200).json(allUsers);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Cria um novo tipo de item */
	public static async createItemType (req: Request, res: Response) {
		const newItemType = req.body;
		try {
			const newItemTypeCreated = (await db.ItemTypes.create(newItemType)).toJSON() as Partial<ItemTypes>;
			return res.status(200).json(newItemTypeCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Este tipo de item já está cadastrado." });

			res.status(500).json(err.message);
		}
	}

	public static get createUserValidations (): ValidationChain[]  {
		return [
			body("name").isString().withMessage("Nome inválido."),
		];
	}

	/* Atualiza o tipo de item */
	public static async updateItemType (req: Request, res: Response) {
		const { idItemType } = req.params;
		const newInfo = req.body;
		try {
			await db.ItemTypes.update(newInfo, { where: { idItemType: Number(idItemType) } });
			const updatedItemType = await db.ItemTypes.findOne({
				attributes: ["idItemType", "name"],
				where: { idUser: Number(idItemType) }
			});
			return res.status(200).json(updatedItemType);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Deletar um tipo de item */
	public static async deleteItemType (req: Request, res: Response) {
		const { idItemType } = req.params; // Fazer validacao de usuario

		/*
		const authDonationItem = res.locals.item as Partial<DonationItems>;
		if (authDonationItem.idUser != Number(idUser))
			return res.status(403).json({ message: "Você não pode deletar um item de outra pessoa, apenas o seu próprio!" });
		*/

		try {
			await db.ItemTypes.destroy({ where: { idItemType: Number(idItemType) } });
			return res.status(200).json({ message: `Item de ID ${idItemType} deletado.` });
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}
}

export default ItemTypeController;
