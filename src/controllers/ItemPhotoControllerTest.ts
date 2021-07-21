import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { DonationItems } from "../database/models/donation_items";
import { ItemPhotos } from "../database/models/item_photos";

class ItemPhotoController {

	constructor () {}

	public static async getAllItemsPhotos (req: Request, res: Response) {
		const { idDonationItem } = req.params
		try {
			const allItems = await db.DonationItems.findAll({
				attributes: ["idItemPhoto", "idDonationItem", "link"],
				where: { idDonationItem: Number(idDonationItem) }
			});
			return res.status(200).json(allItems);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async getItemPhotoById (req: Request, res: Response) {
		const { idDonationItem, idItemPhoto } = req.params;
		try {
			const item = await db.DonationItems.findOne({
				attributes: ["idItemPhoto", "idDonationItem", "link"],
				where: { idDonationItem: Number(idDonationItem), idItemPhoto: Number(idItemPhoto) }
			});
			return res.status(200).json(item);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async createItemPhoto (req: Request, res: Response) {
		const { idUser, idDonationItem } = req.params;
		const newItemPhoto = { ...req.body, idUser: Number(idUser), idDonationItem: Number(idDonationItem) };
		try {
			const newItemPhotoCreated = (await db.DonationItems.create(newItemPhoto)).toJSON() as Partial<ItemPhotos>;
			return res.status(200).json(newItemPhotoCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Esta foto ja foi utilizada." });

			res.status(500).json(err.message);
		}
	}

	public static get createUserValidations (): ValidationChain[]  {
		return [
			body("idDonationItem").isIn([DonationItems]).withMessage("ID de item invalido."),
			body("link").isURL().withMessage("Link invalida.")
		];
	}

	public static async updateItemPhoto (req: Request, res: Response) {
		const { idDonationItem, idItemPhoto } = req.params;
		const newInfo = req.body;
		try {
			await db.ItemPhotos.update(newInfo, { where: { idDonationItem: Number(idDonationItem), idItemPhoto: Number(idItemPhoto) } });
			const updatedUser = await db.DonationItems.findOne({
				attributes: ["idItemPhoto", "idDonationItem", "link"],
				where: { idDonationItem: Number(idDonationItem), idItemPhoto: Number(idItemPhoto) }
			});
			return res.status(200).json(updatedUser);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async deleteItemPhoto (req: Request, res: Response) {
		const { idItemPhoto } = req.params;

		/*
		const authItemPhotos = res.locals.item as Partial<ItemPhotos>;
		if (authItemPhotos.idUser != Number(idUser))
			return res.status(403).json({ message: "Você não pode deletar um item de outra pessoa, apenas o seu próprio!" });
		*/

		try {
			await db.ItemPhotos.destroy({ where: { idItemPhoto: Number(idItemPhoto) } });
			return res.status(200).json({ message: `Imagem de ID ${idItemPhoto} deletado.` });
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

}

export default ItemPhotoController;
