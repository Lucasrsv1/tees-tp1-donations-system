import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { DonationItems } from "../database/models/donation_items";
import { Solicitations } from "../database/models/solicitations";
import { Users } from "../database/models/users";

class SolicitationController {
	constructor () { }

	/* Mostra todas solicitações do usuário */
	public static async getAllSolicitationsOfUser (req: Request, res: Response) {
		const { idUser } = req.params; // Fazer validação de usuário
		try {
			const allSolicitation = await db.Solicitations.findAll({
				attributes: ["idSolicitation", "idDonationItem", "justification", "validation"],
				where: { idUser: Number(idUser) }
			});
			return res.status(200).json(allSolicitation);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Mostra uma solicitação do usuário a partir de seu id */
	public static async getSolicitationOfUserById (req: Request, res: Response) {
		const { idUser, idSolicitation } = req.params; // Fazer validação de usuário
		try {
			const allSolicitation = await db.Solicitations.findAll({
				attributes: ["idDonationItem", "justification", "validation"],
				where: { idUser: Number(idUser), idSolicitation: Number(idSolicitation) }
			});
			return res.status(200).json(allSolicitation);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Mostra todas solicitações recebidas para um item do usuário */
	public static async getAllSolicitationsOfItem (req: Request, res: Response) {
		const { idDonationItem } = req.params; // Fazer validação de usuário
		try {
			const allSolicitation = await db.Solicitations.findAll({
				attributes: ["idDonationItem", "justification", "validation"],
				where: { idDonationItem: Number(idDonationItem) }
			});
			return res.status(200).json(allSolicitation);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Mostra uma solicitação, a partir do seu id, recebida para um item do usuário */
	public static async getSolicitationOfItemById (req: Request, res: Response) {
		const { idDonationItem } = req.params; // Fazer validação de usuário
		try {
			const allSolicitation = await db.Solicitations.findAll({
				attributes: ["idDonationItem", "justification", "validation"],
				where: { idDonationItem: Number(idDonationItem) }
			});
			return res.status(200).json(allSolicitation);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Cria uma solicitação para um item especifico */
	public static async createSolicitation (req: Request, res: Response) {
		const { idUser, idDonationItem } = req.params; // Fazer validação de usuário
		const newSolicitation = { ...req.body, idUser: Number(idUser), idDonationItem: Number(idDonationItem) };
		try {
			const newSolicitationCreated = (await db.Solicitations.create(newSolicitation)).toJSON() as Partial<Solicitations>;
			return res.status(200).json(newSolicitationCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Esta solicitação já está cadastrada." });

			res.status(500).json(err.message);
		}
	}

	public static get createSolicitationValidations (): ValidationChain[]  {
		return [
			body("idUser").isIn([Users]).withMessage("Usuário invalido."),
			body("idDonationItem").isIn([DonationItems]).withMessage("Tipo de item invalido."),
			body("justification").isString().withMessage("Justificativa inválida.")
		];
	}

	/* Atualiza uma solicitação para um item especifico */
	public static async updateSolicitation (req: Request, res: Response) {
		const { idUser, idSolicitation } = req.params; // Fazer validação de usuário
		const newInfo = req.body;
		try {
			await db.DonationItems.update(newInfo, { where: { idUser: Number(idUser), idSolicitation: Number(idSolicitation) } });
			const updatedSolicitation = await db.Solicitations.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city"],
				where: { idUser: Number(idUser), idSolicitation: Number(idSolicitation) }
			});
			return res.status(200).json(updatedSolicitation);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	/* Deleta uma solicitação para um item especifico */
	public static async deleteSolicitation (req: Request, res: Response) {
		const { idUser, idSolicitation } = req.params; // Fazer validação de usuário

		/*
		const authDonationItem = res.locals.item as Partial<DonationItems>;
		if (authDonationItem.idUser != Number(idUser))
			return res.status(403).json({ message: "Você não pode deletar um item de outra pessoa, apenas o seu próprio!" });
		*/

		try {
			await db.Solicitations.destroy({ where: { idSolicitation: Number(idSolicitation) } });
			return res.status(200).json({ message: `Item de ID ${idSolicitation} deletado.` });
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}


}

export default SolicitationController;
