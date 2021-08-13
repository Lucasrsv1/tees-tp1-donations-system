import fs from "fs";
import moment from "moment";
import path from "path";

import { Request, Response } from "express";
import { body } from "express-validator";
import { Op } from "sequelize";

import EmailController from "./EmailController";
import LoginController from "./LoginController";

import db from "../database/models";
import { DonationItems, Validation } from "../database/models/donation_items";
import { Solicitations } from "../database/models/solicitations";
import { Users } from "../database/models/users";

class DonationItemController {
	// ============= Donations ============= //

	/**
	 * Obtém todas as doações do usuário
	 */
	public static async getAllUserDonations (req: Request, res: Response): Promise<void> {
		try {
			const user = res.locals.user as Partial<Users>;
			const donations = await db.DonationItems.findAll({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "idDonationItem", "link"],
					required: false
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}, {
					association: "solicitations",
					attributes: ["idSolicitation"],
					where: { validation: Validation.APPROVED },
					required: false
				}],
				where: {
					idUser: user.idUser,
					validation: { [Op.ne]: Validation.DENIED },
					[Op.and]: db.Sequelize.where(
						db.Sequelize.col("solicitations.id_solicitation"),
						"IS",
						null
					)
				},
				order: [["description", "ASC"]]
			});
			res.status(200).json(donations);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	/**
	 * Procura por doações
	 */
	public static async searchDonations (req: Request, res: Response): Promise<void> {
		try {
			const user = res.locals.user as Partial<Users>;
			const { search, itemTypes } = req.query;

			const donations = await db.DonationItems.findAll({
				attributes: [
					"idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "createdAt"
				],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "idDonationItem", "link"],
					required: false
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}, {
					association: "solicitations",
					attributes: ["idSolicitation"],
					where: {
						[Op.or]: {
							idUser: user.idUser,
							validation: Validation.APPROVED
						}
					},
					required: false
				}],
				where: {
					idUser: { [Op.ne]: user.idUser },
					validation: Validation.APPROVED,
					...(search ? {
						[Op.or]: {
							description: { [Op.iLike]: `%${search}%` },
							city: { [Op.iLike]: `%${search}%` },
							state: { [Op.iLike]: `%${search}%` }
						}
					} : { }),
					...(itemTypes ? { idItemType: (itemTypes as string).split(",") } : { }),
					[Op.and]: db.Sequelize.where(
						db.Sequelize.col("solicitations.id_solicitation"),
						"IS",
						null
					)
				},
				order: [["createdAt", "DESC"]]
			});

			res.status(200).json(donations);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	/**
	 * Obtém uma doação pela ID
	 */
	public static async getDonation (req: Request, res: Response): Promise<void> {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;

		try {
			const donation = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "idDonationItem", "link"],
					required: false
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
				res.status(404).json({ message: "Doação não encontrada." });
			else
				res.status(200).json(donation);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	/**
	 * Cria uma nova doação de um item
	 */
	public static async createDonation (req: Request, res: Response): Promise<void> {
		const user = res.locals.user as Partial<Users>;
		const newDonation = { ...req.body, idUser: user.idUser };

		// Garante que não será enviado valor de validação
		delete newDonation.validation;

		try {
			const newDonationItemCreated = (await db.DonationItems.create(newDonation)).toJSON() as Partial<DonationItems>;
			res.status(200).json(newDonationItemCreated);
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
	public static async updateDonation (req: Request, res: Response): Promise<void> {
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
					attributes: ["idItemPhoto", "link"],
					required: false
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}],
				where: {
					idUser: user.idUser,
					idDonationItem: Number(idDonation)
				}
			});
			res.status(200).json(updatedDonationItem);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
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
	public static async deleteDonation (req: Request, res: Response): Promise<void> {
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
				res.status(200).json({ message: `Doação de ID ${idDonation} deletada.` });
			else
				res.status(404).json({ message: "Doação não encontrada." });
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	// ============= Photos ============= //

	public static async savePhoto (req: Request, res: Response): Promise<void> {
		const { idDonation } = req.params;
		if (req.files && req.files.photo) {
			const ext = req.body.file_name.substring(req.body.file_name.lastIndexOf("."));
			const name = moment().format("YYYYMMDDHHmmssSSS") + ext;

			try {
				const file = req.files.photo instanceof Array ? req.files.photo[0] : req.files.photo;
				await file.mv(path.resolve(__dirname, "..", "uploads", name));

				const photo = await db.ItemPhotos.create({
					idDonationItem: Number(idDonation),
					link: name
				});

				res.status(201).json(photo);
			} catch (error) {
				res.status(500).json(error);
			}
		}
	}

	public static async deletePhoto (req: Request, res: Response): Promise<void> {
		const user = res.locals.user as Partial<Users>;
		const { idDonation, idPhoto } = req.params;

		try {
			const photo = await db.ItemPhotos.findOne({
				attributes: ["idItemPhoto", "link"],
				include: [{
					association: "donation",
					attributes: ["idDonationItem"],
					where: {
						idUser: user.idUser,
						idDonationItem: Number(idDonation)
					},
					required: true
				}],
				where: { idItemPhoto: Number(idPhoto) }
			});

			if (!photo) {
				res.status(404).json({ message: "Foto não encontrada." });
				return;
			}

			fs.renameSync(
				path.resolve(__dirname, "..", "uploads", photo.link),
				path.resolve(__dirname, "..", "uploads", "deleted", photo.link)
			);

			await photo.destroy();
			res.status(200).json({ message: "Fotos deletada." });
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	// ============= Validation ============= //

	public static async getPendingValidation (req: Request, res: Response): Promise<void> {
		try {
			const donations = await db.DonationItems.findAll({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				include: [{
					association: "photos",
					attributes: ["idItemPhoto", "link"],
					required: false
				}, {
					association: "itemType",
					attributes: ["idItemType", "name"]
				}],
				where: { validation: Validation.WAITING }
			});
			res.status(200).json(donations);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	public static async setValidation (req: Request, res: Response): Promise<void> {
		const { idDonation } = req.params;
		const { validation, reason } = req.body;

		try {
			await db.DonationItems.update({ validation }, {
				where: { idDonationItem: idDonation }
			});

			await EmailController.validateDonationEmail(Number(idDonation), validation, reason);
			res.status(200).json({ message: "Validação da doação atualizada." });
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
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

	public static async getSolicitations (req: Request, res: Response): Promise<void> {
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
				res.status(200).json(donation.solicitations || []);
			else
				res.status(404).json({ message: "Doação não encontrada." });
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	public static async solicit (req: Request, res: Response): Promise<void> {
		const user = res.locals.user as Partial<Users>;
		const { idDonation } = req.params;
		const { justification } = req.body;

		try {
			const newSolicitation = (await db.Solicitations.create({
				idUser: user.idUser,
				idDonationItem: idDonation,
				justification
			})).toJSON() as Partial<Solicitations>;

			res.status(200).json(newSolicitation);
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}

	public static async confirmSolicitation (req: Request, res: Response): Promise<void> {
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

			if (!donation) {
				res.status(404).json({ message: "Doação não encontrada." });
				return;
			}

			await db.Solicitations.update({ validation: Validation.DENIED }, {
				where: {
					idUser: { [Op.ne]: idUser },
					idDonationItem: Number(idDonation)
				}
			});

			await db.Solicitations.update({ validation: Validation.APPROVED }, {
				where: {
					idUser,
					idDonationItem: Number(idDonation)
				}
			});

			await EmailController.validateSolicitationsEmail(Number(idDonation), idUser);
			res.status(200).json({ message: "Doação confirmada." });
		} catch (err) {
			console.error(err);
			res.status(500).json(err.message);
		}
	}
}

export default DonationItemController;
