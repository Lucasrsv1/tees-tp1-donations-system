import db from '../database/models';
//import {UserType} from '../database/models/users';

class UserController {

	constructor() {}

	public static async getAllUsers(req:any, res:any) {
		try {
			const allUsers = await db.Users.findAll();
			return res.status(200).json(allUsers);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async getOneUserById(req:any, res:any) {
		const { idUser } = req.params;
		try {
			const user = await db.Users.findOne( { where: { idUser:Number(idUser) } } );
			return res.status(200).json(user);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async getOneUserByLogin(req:any, res:any) {
		const { email, password } = req.body;
		try {
			const user = await db.Users.findOne( { where: {email:String(email), password:String(password) } } );
			return res.status(200).json(user);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async createUser(req:any, res:any) {
		const newUser = req.body;
		//let userType = type as UserType;
		try {
			const newUserCreated = await db.Users.create( newUser );
			return res.status(200).json(newUserCreated);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async updateUser(req:any, res:any) {
		const { idUser } = req.params;
		const newInfo = req.body;
		try {
			await db.Users.update( newInfo, { where: { idUser:Number(idUser) } } );
			const updatedUser = await db.Users.findOne( { where: { idUser:Number(idUser) } } );
			return res.status(200).json(updatedUser);
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}

	public static async deleteUser(req:any, res:any) {
		const { idUser } = req.params;
		try {
			await db.Users.destroy( { where: { idUser:Number(idUser) } } );
			return res.status(200).json( {message: `id ${idUser} deleted` } );
		} catch (err) {
			return res.status(500).json(err.message);
		}
	}
}

export default UserController;
