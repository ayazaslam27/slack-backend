import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../common/errors/bad-request-error";
import { validateResult } from "../common/middleware/validate-request";
import { User } from "../models/user";

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("displayName").not().isEmpty().withMessage("User name is required"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 charachters"),
	],
	validateResult,
	async (req: Request, res: Response) => {
		const { email, password, displayName, userImage } = req.body;

		console.log(req.body);

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError("Email already in use");
		}

		const user = User.build({ email, password, userImage, displayName });
		await user.save();

		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
