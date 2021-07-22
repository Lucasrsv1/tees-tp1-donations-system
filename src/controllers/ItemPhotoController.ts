import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { DonationItems } from "../database/models/donation_items";
import { ItemPhotos } from "../database/models/item_photos";

class ItemPhotoController {

	constructor () {}

	/* Mostra todas as fotos de um item */
	public static async getAllItemPhotos (req: Request, res: Response) {
		const { idDonationItem } = req.params
		try {
			const allItems = await db.ItemPhotos.findAll({
				attributes: ["idItemPhoto", "idDonationItem", "link"],
				where: { idDonationItem: Number(idDonationItem) }
			});
			return res.status(200).json(allItems);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Mostra uma foto especifica, a partir de seu id, de um item */
	public static async getItemPhotoById (req: Request, res: Response) {
		const { idDonationItem, idItemPhoto } = req.params;
		try {
			const item = await db.ItemPhotos.findOne({
				attributes: ["idItemPhoto", "idDonationItem", "link"],
				where: { idDonationItem: Number(idDonationItem), idItemPhoto: Number(idItemPhoto) }
			});
			return res.status(200).json(item);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Cria uma foto para um item */
	public static async createItemPhoto (req: Request, res: Response) {
		const { idUser, idDonationItem } = req.params; // Fazer validacao de usuario
		const newItemPhoto = { ...req.body, idUser: Number(idUser), idDonationItem: Number(idDonationItem) };
		try {
			const newItemPhotoCreated = (await db.ItemPhotos.create(newItemPhoto)).toJSON() as Partial<ItemPhotos>;
			return res.status(200).json(newItemPhotoCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Esta foto ja foi criada." });

			res.status(500).json(err.message);
		}
	}

	public static get createUserValidations (): ValidationChain[]  {
		return [
			body("idDonationItem").isIn([DonationItems]).withMessage("ID de item invalido."),
			body("link").isURL().withMessage("Link invalida.")
		];
	}

	/* Atualiza a foto de um item */
	public static async updateItemPhoto (req: Request, res: Response) {
		const { idUser, idDonationItem, idItemPhoto } = req.params; // Fazer validacao de usuario
		const newInfo = req.body;
		try {
			await db.ItemPhotos.update(newInfo, { where: { idDonationItem: Number(idDonationItem), idItemPhoto: Number(idItemPhoto) } });
			const updatedItemPhoto = await db.ItemPhotos.findOne({
				attributes: ["idItemPhoto", "idDonationItem", "link"],
				where: { idDonationItem: Number(idDonationItem), idItemPhoto: Number(idItemPhoto) }
			});
			return res.status(200).json(updatedItemPhoto);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Deleta uma foto de um item */
	public static async deleteItemPhoto (req: Request, res: Response) {
		const { idUser, idItemPhoto } = req.params; // Fazer validacao de usuario

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
