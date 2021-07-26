import { NextFunction, Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { sign, verify, VerifyErrors } from "jsonwebtoken";

import db from "../database/models";
import { Users, UserType } from "../database/models/users";
import HttpValidation from "./HttpValidation";

const KEY_TOKEN = "U7rLThGJD3BAZg0$d*%6DeKZdChEzPEz";
const EXPIRATION_TIME = 3 * 24 * 60 * 60;

class LoginController {
	constructor () { }

	public static ensureAuthorized (req: Request, res: Response, next: NextFunction): void {
		const token = req.headers["x-access-token"] as string;
		if (!token) {
			res.status(403).json({ message: "Acesso não autorizado. A sessão do usuário é inválida." });
			return res.end();
		}

		verify(token, KEY_TOKEN, (error: VerifyErrors, user: Partial<Users>) => {
			if (error) {
				res.status(403).json({
					message: "Acesso não autorizado. A sessão do usuário é inválida.",
					expired: error.name === "TokenExpiredError",
					error
				});
				return res.end();
			}

			res.locals.user = user;
			next(null);
		});
	}

	public static ensureAdministrator (req: Request, res: Response, next: NextFunction): void {
		const user = res.locals.user as Partial<Users>;
		if (user.type !== UserType.ADM) {
			res.status(403).json({
				message: "Acesso não autorizado. Você não é administrador."
			});
			return res.end();
		}

		next(null);
	}

	public static async login (req: Request, res: Response): Promise<void | any> {
		if (HttpValidation.isRequestInvalid(req, res)) return;

		try {
			const user = await db.Users.findOne({
				attributes: ["idUser", "name", "email", "type"],
				where: {
					email: req.body.email,
					password: req.body.password
				}
			});

			if (!user)
				return res.status(403).json({ message: "E-mail ou senha incorretos." });

			const plainUser = user.toJSON() as Partial<Users>;
			const token = sign(plainUser, KEY_TOKEN, { expiresIn: EXPIRATION_TIME });
			res.status(200).json({ token });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Erro ao fazer login.", error });
		}
	}

	public static get loginValidations (): ValidationChain[] {
		return [
			body("email").isEmail().withMessage("E-mail inválido.").normalizeEmail(),
			body("password").isString().withMessage("Senha inválida.")
		];
	}
}

export default LoginController;
