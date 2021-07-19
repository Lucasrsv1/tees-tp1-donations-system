import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { Users, UserType } from "../database/models/users";

class UserController {
	constructor () { }

	public static async getAllUsers (req: Request, res: Response) {
		try {
			const allUsers = await db.Users.findAll({
				attributes: ["idUser", "name", "email", "type"]
			});
			return res.status(200).json(allUsers);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async getOneUserById (req: Request, res: Response) {
		const { idUser } = req.params;
		try {
			const user = await db.Users.findOne({
				attributes: ["idUser", "name", "email", "type"],
				where: { idUser: Number(idUser) }
			});
			return res.status(200).json(user);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async createUser (req: Request, res: Response) {
		const newUser = req.body;
		try {
			const newUserCreated = (await db.Users.create(newUser)).toJSON() as Partial<Users>;
			delete newUserCreated.password;
			return res.status(200).json(newUserCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Este e-mail já está cadastrado." });

			res.status(500).json(err.message);
		}
	}

	public static get createUserValidations (): ValidationChain[]  {
		return [
			body("name").isString().withMessage("Nome inválido."),
			body("email").isEmail().withMessage("E-mail inválido.").normalizeEmail(),
			body("password").isString().withMessage("Senha inválida."),
			body("type").isIn([UserType.ADM, UserType.PF, UserType.PJ]).withMessage("Tipo de conta inválida.")
		];
	}

	public static async updateUser (req: Request, res: Response) {
		const { idUser } = req.params;
		const newInfo = req.body;
		try {
			await db.Users.update(newInfo, { where: { idUser: Number(idUser) } });
			const updatedUser = await db.Users.findOne({
				attributes: ["idUser", "name", "email", "type"],
				where: { idUser: Number(idUser) }
			});
			return res.status(200).json(updatedUser);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async deleteUser (req: Request, res: Response) {
		const { idUser } = req.params;

		const authUser = res.locals.user as Partial<Users>;
		if (authUser.idUser != Number(idUser))
			return res.status(403).json({ message: "Você não pode deletar outro usuário, apenas o seu próprio!" });

		try {
			await db.Users.destroy({ where: { idUser: Number(idUser) } });
			return res.status(200).json({ message: `Usuário de ID ${idUser} deletado.` });
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}
}

export default UserController;
