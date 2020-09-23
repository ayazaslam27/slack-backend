import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth } from "../common/middleware/require-auth";
import { validateResult } from "../common/middleware/validate-request";
import { currentUser } from "../common/middleware/current-user";
import { Room, Message } from "../models/room";

const router = express.Router();

router.post(
	"/api/room/create",
	currentUser,
	requireAuth,
	[body("name").not().isEmpty().withMessage("Room title is required")],
	validateResult,
	async (req: Request, res: Response) => {
		const { name } = req.body;
		const messages: Message[] = [];
		const room = Room.build({ name, messages });

		await room.save();

		res.status(201).send(room);
	}
);

export { router as createRoomRouter };
