import { Request, Response } from "express";
import { body } from "express-validator";

import db from "../database/models";
import { DonationItems, Validation } from "../database/models/donation_items";
import { Users } from "../database/models/users";

import LoginController from "./LoginController";

class DonationItemController {
	constructor () { }

	// ============= Donations ============= //

	/**
	 * Obtém todas as doações do usuário
	 */
	public static async getAllUserDonations (req: Request, res: Response) {
		try {
			const user = res.locals.user as Partial<Users>;
			const donations = await db.DonationItems.findAll({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "link"]
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}],
				where: { idUser: user.idUser }
			});
			return res.status(200).json(donations);
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	/**
	 * Obtém uma doação pela ID
	 */
	public static async getDonation (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;

		try {
			const donation = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "link"]
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}, {
					association: "solicitations",
					attributes: ["idSolicitation", "idUser", "idDonationItem", "justification", "validation"],
					include: [{
						association: "user",
						attributes: ["name", "email"]
					}]
				}],
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});

			if (!donation)
				return res.status(404).json({ message: "Doação não encontrada!" });

			return res.status(200).json(donation);
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	/**
	 * Cria uma nova doação de um item
	 */
	public static async createDonation (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const newDonation = { ...req.body, idUser: user.idUser };

		// Garante que não será enviado valor de validação
		delete newDonation.validation;

		try {
			const newDonationItemCreated = (await db.DonationItems.create(newDonation)).toJSON() as Partial<DonationItems>;
			return res.status(200).json(newDonationItemCreated);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	public static get createDonationValidations () {
		return [
			LoginController.ensureAuthorized,
			body("idItemType").isInt({ gt: 0 }).withMessage("Tipo de item inválido."),
			body("description").isString().withMessage("Descrição inválida."),
			body("quantity").isInt({ gt: 0 }).withMessage("Quantidade deve ser um número maior que zero."),
			body("state").isString().withMessage("Estado inválido."),
			body("city").isString().withMessage("Cidade inválida.")
		];
	}

	/**
	 * Atualiza informações de um item para doação
	 */
	public static async updateDonation (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;
		const newInfo = req.body;

		// Garante que não será enviado valor de validação
		delete newInfo.validation;

		try {
			await db.DonationItems.update(newInfo, {
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});

			const updatedDonationItem = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "link"]
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}],
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});
			return res.status(200).json(updatedDonationItem);
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	public static get updateDonationValidations () {
		return [
			LoginController.ensureAuthorized,
			body("idItemType").isInt({ gt: 0 }).withMessage("Tipo de item inválido."),
			body("description").isString().withMessage("Descrição inválida."),
			body("quantity").isInt({ gt: 0 }).withMessage("Quantidade deve ser um número maior que zero."),
			body("state").isString().withMessage("Estado inválido."),
			body("city").isString().withMessage("Cidade inválida.")
		];
	}

	/**
	 * Deleta uma doação
	 */
	public static async deleteDonation (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;

		try {
			const qty = await db.DonationItems.destroy({
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});

			if (qty > 0)
				return res.status(200).json({ message: `Doação de ID ${idDonation} deletada.` });

			return res.status(404).json({ message: "Doação não deletada." });
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	// ============= Photos ============= //

	public static async savePhotos (req: Request, res: Response) { }

	public static async deletePhotos (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;

		try {
			const photos = await db.ItemPhotos.findAll({
				attributes: ["idItemPhoto"],
				include: [{
					association: "donation",
					attributes: ["idDonationItem"],
					where: {
						idUser: user.idUser,
						idDonationItem: Number(idDonation)
					},
					required: true
				}],
				where: { idItemPhoto: (req.query.photoIds || "").toString().split(",").map(i => +i) },
				raw: true,
				nest: true
			});

			const validIDs = photos.map(p => p.idItemPhoto);
			const qty = await db.ItemPhotos.destroy({ where: { idItemPhoto: validIDs } });

			return res.status(200).json({ message: `${qty} fotos deletadas.` });
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	// ============= Validation ============= //

	public static async getPendingValidation (req: Request, res: Response) {
		try {
			const donations = await db.DonationItems.findAll({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "link"]
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}],
				where: { validation: Validation.WAITING }
			});
			return res.status(200).json(donations);
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	public static async setValidation (req: Request, res: Response) {
		const { idDonation } = req.params;
		const { validation } = req.body;

		try {
			await db.DonationItems.update({ validation }, {
				where: { idDonationItem: idDonation }
			});
			return res.status(200).json({ message: "Validação da doação atualizada." });
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	public static get setValidationValidations () {
		return [
			LoginController.ensureAuthorized,
			LoginController.ensureAdministrator,
			body("validation").isIn([Validation.APPROVED, Validation.DENIED, Validation.WAITING]).withMessage("Valor de validação inválido.")
		];
	}

	// ============= Solicitations ============= //

	public static async getSolicitations (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;

		try {
			const donation = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser"],
				include: [{
					association: "solicitations",
					attributes: ["idSolicitation", "idUser", "idDonationItem", "justification", "validation"],
					include: [{
						association: "user",
						attributes: ["name", "email"]
					}]
				}],
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});

			if (donation)
				return res.status(200).json(donation.solicitations || []);

			return res.status(404).json({ message: "Doação não encontrada." });
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}

	public static async confirmSolicitation (req: Request, res: Response) {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;
		const { idUser } = req.body;

		try {
			const donation = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser"],
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});

			if (!donation)
				return res.status(404).json({ message: "Doação não encontrada." });

			await db.Solicitations.update({ validation: Validation.DENIED }, {
				where: {
					idUser: { $ne: idUser },
					idDonationItem: Number(idDonation)
				}
			});

			await db.Solicitations.update({ validation: Validation.APPROVED }, {
				where: {
					idUser,
					idDonationItem: Number(idDonation)
				}
			});

			return res.status(200).json({ message: "Doação confirmada." });
		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}
	}
}

export default DonationItemController;
