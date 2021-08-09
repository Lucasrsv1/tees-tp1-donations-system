import { Request, Response } from "express";
import { body } from "express-validator";

import db from "../database/models";
import { ItemTypes } from "../database/models/item_types";

import LoginController from "./LoginController";

class ItemTypeController {
	/**
	 * Obtém todos os tipos de itens
	 */
	public static async getAllItemTypes (req: Request, res: Response) {
		try {
			const allItemTypes = await db.ItemTypes.findAll({
				attributes: ["idItemType", "name"]
			});
			return res.status(200).json(allItemTypes);
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	/**
	 * Cria um novo tipo de item
	 */
	public static async createItemType (req: Request, res: Response) {
		const newItemType = req.body;
		try {
			const newItemTypeCreated = (await db.ItemTypes.create(newItemType)).toJSON() as Partial<ItemTypes>;
			return res.status(200).json(newItemTypeCreated);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	public static get createItemTypeValidations ()  {
		return [
			LoginController.ensureAuthorized,
			body("name").isString().withMessage("Nome inválido.")
		];
	}

	/**
	 * Atualiza o tipo de item
	 */
	public static async updateItemType (req: Request, res: Response) {
		const { idItemType } = req.params;
		const name = req.body.name;
		try {
			await db.ItemTypes.update({ name }, {
				where: { idItemType: Number(idItemType) }
			});
			const updatedItemType = await db.ItemTypes.findOne({
				attributes: ["idItemType", "name"],
				where: { idItemType: Number(idItemType) }
			});
			return res.status(200).json(updatedItemType);
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	/**
	 * Deletar um tipo de item
	 */
	public static async deleteItemType (req: Request, res: Response) {
		const { idItemType } = req.params;

		try {
			const qty = await db.ItemTypes.destroy({ where: { idItemType: Number(idItemType) } });
			if (qty > 0)
				return res.status(200).json({ message: `Tipo de item de ID ${idItemType} deletado.` });

			return res.status(404).json({ message: `Tipo de item não deletado.` });
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}
}

export default ItemTypeController;
