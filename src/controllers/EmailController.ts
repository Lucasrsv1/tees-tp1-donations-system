import { Request, Response } from "express";
import * as nodemailer from 'nodemailer';

import db from "../database/models";
import { DonationItems, Validation } from "../database/models/donation_items";
import { Users } from "../database/models/users";

/*
 * Configuracao do email
*/


const config = {
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "c9f1f71a5f208a",
		pass: "ec01747b68e438"
	}
};

const transporter = nodemailer.createTransport(config);

class EmailController {

	constructor () { }

	/*
	 * Envia email informando sobre aprovacao de um certo item para doacao
	*/
	public static async validateDonationEmail (req:Request, res:Response) {
		const { idDonation } = req.params;
		let valid = Validation.WAITING;

		try {
			const donation = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				where: {
					idDonationItem: Number(idDonation)
				}
			});
			if (!donation)
				return res.status(404).json({ message: "Doação não encontrada." });

			const user = await db.Users.findOne({
				attributes: ["idUser", "name", "email", "type"],
				where: {
					idUser: donation.idUser
				}
			});
			if (!user)
				return res.status(403).json({ message: "Usuario nao encontrado." });

			if (donation.validation == Validation.APPROVED)
				valid = Validation.APPROVED;
			else
				valid = Validation.DENIED;

			const message = {
				from: "Admin <admin@donationsystem.com",
				to: user.email,
				subject: "Resultado criacao de doacao",
				text: "Sua doacao foi" + valid.toString
			}
			transporter.sendMail(message, (error, info) => {
				if (error) {
					return res.status(400).send("Falha ao enviar o email.");
				}
			});

			return res.status(200);

		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}

	}

	/*
	 * Envia email informando sobre nova solicitacao em um certo item
	*/
	public static async validateSolicitationEmail (req:Request, res:Response) {
		const { idSolicitation } = req.params;
		let valid = Validation.WAITING;

		try {
			const solicitation = await db.Solicitations.findOne({
				attributes: ["idDonationItem", "idUser", "idItemType", "description", "quantity", "state", "city", "validation"],
				where: {
					idDonationItem: Number(idSolicitation)
				}
			});
			if (!solicitation)
				return res.status(404).json({ message: "Solicitacao não encontrada." });

			const user = await db.Users.findOne({
				attributes: ["idUser", "name", "email", "type"],
				where: {
					idUser: solicitation.idUser
				}
			});
			if (!user)
				return res.status(403).json({ message: "Usuario nao encontrado." });

			if (solicitation.validation == Validation.APPROVED)
				valid = Validation.APPROVED;
			else
				valid = Validation.DENIED;

			const message = {
				from: "Admin <admin@donationsystem.com",
				to: user.email,
				subject: "Resultado de sua solicitacao",
				text: "Sua doacao foi" + valid.toString
			}
			transporter.sendMail(message, (error, info) => {
				if (error) {
					return res.status(400).send("Falha ao enviar o email.");
				}
			});

			return res.status(200);

		} catch (err) {
			console.error(err);
			return res.status(500).json(err.message);
		}

	}

}


export default EmailController;
