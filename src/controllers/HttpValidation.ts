import { Request, Response } from "express";
import { validationResult } from "express-validator";

class HttpValidation {
	public static isRequestInvalid (req: Request, res: Response): boolean {
		const validation = validationResult(req);
		if (validation.isEmpty())
			return false;

		res.status(400).json({ message: validation.array()[0].msg, errors: validation.array() });
		return true;
	}
}

export default HttpValidation;
