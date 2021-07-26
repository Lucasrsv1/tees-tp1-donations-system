import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { UniqueConstraintError } from "sequelize";

import db from "../database/models";
import { Users, UserType } from "../database/models/users";

class UserController {
	constructor () { }

	/**
	 * Cadastra usuário
	 */
	public static async createUser (req: Request, res: Response) {
		const newUser = req.body;
		try {
			const newUserCreated = (await db.Users.create(newUser)).toJSON() as Partial<Users>;
			delete newUserCreated.password;
			return res.status(200).json(newUserCreated);
		} catch (err) {
			if (err instanceof UniqueConstraintError)
				return res.status(400).json({ message: "Este e-mail já está cadastrado." });

			console.error(err);
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

}

export default UserController;
