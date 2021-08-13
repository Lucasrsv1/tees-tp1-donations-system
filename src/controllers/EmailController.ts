import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import db from "../database/models";
import { Validation } from "../database/models/donation_items";
import { Solicitations } from "../database/models/solicitations";

class EmailController {
	/*
	* Configuração do email
	*/
	private static config: SMTPTransport.Options = {
		host: "debugmail.io",
		port: 25,
		auth: {
			user: "lucasrsv1@gmail.com",
			pass: "bc306380-f8bc-11eb-b0ca-c726edbab6e7"
		}
	};

	private static transporter = nodemailer.createTransport(EmailController.config);

	/*
	 * Envia email informando sobre aprovação de um certo item para doação
	 */
	public static async validateDonationEmail (idDonationItem: number, validation: Validation, reason: string): Promise<void> {
		try {
			const donation = await db.DonationItems.findOne({
				attributes: ["idDonationItem", "idUser", "description"],
				where: { idDonationItem },
				raw: true
			});

			if (!donation)
				return console.error("Não foi possível enviar o e-mail. Doação não encontrada.");

			const user = await db.Users.findOne({
				attributes: ["idUser", "email"],
				where: { idUser: donation.idUser },
				raw: true
			});

			if (!user || !user.email)
				return console.error("Não foi possível enviar o e-mail. Usuário ou email não encontrados.");

			const valid = validation == Validation.APPROVED;
			const message: Mail.Options = {
				from: "Admin <adm@donations.com>",
				to: user.email,
				subject: "Resultado criação de doação",
				text: `Sua doação "${donation.description}" foi ` + (valid ? "aprovada." : `reprovada.\nJustificativa: ${reason}`)
			};

			await EmailController.transporter.sendMail(message);
			console.log("E-mail enviado.");
		} catch (err) {
			console.error("Falha ao enviar o e-mail.", err);
		}
	}

	/**
	 * Envia email informando sobre nova solicitação em um certo item
	 * @param idDonationItem ID da doação
	 * @param idUser ID do usuário que receberá a doação
	 */
	public static async validateSolicitationsEmail (idDonationItem: number, idUser: number): Promise<void> {
		try {
			const solicitations = await db.Solicitations.findAll({
				attributes: ["idSolicitation", "idUser", "idDonationItem"],
				include: [{
					attributes: ["email"],
					association: "user"
				}, {
					attributes: ["description"],
					association: "donation"
				}],
				where: { idDonationItem: Number(idDonationItem) },
				raw: true,
				nest: true
			});

			if (!solicitations || !solicitations.length)
				return console.log("Nenhuma solicitação não encontrada.");

			const promises = [];
			for (const solicitation of solicitations)
				promises.push(EmailController.answerSolicitation(solicitation, solicitation.idUser == idUser));

			await Promise.all(promises);
		} catch (err) {
			console.error("Falha ao enviar os e-mails.", err);
		}
	}

	private static async answerSolicitation (solicitation: Solicitations, valid: boolean): Promise<void> {
		const message: Mail.Options = {
			from: "Admin <adm@donations.com>",
			to: solicitation.user.email,
			subject: "Resultado de sua solicitação",
			text: `Sua solicitação da doação "${solicitation.donation.description}" foi ${valid ? "aprovada" : "reprovada"}.`
		};

		try {
			await EmailController.transporter.sendMail(message);
			console.log("E-mail enviado.");
		} catch (err) {
			console.error("Falha ao enviar o e-mail.", err);
		}
	}
}

export default EmailController;
