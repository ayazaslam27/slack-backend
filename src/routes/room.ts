import express, { Request, Response } from "express";
import { validateResult } from "../common/middleware/validate-request";
import { query } from "express-validator";
import mongoose from "mongoose";
import { currentUser } from "../common/middleware/current-user";
import { requireAuth } from "../common/middleware/require-auth";
import { Room } from "../models/room";

const router = express.Router();

router.get(
	"/api/room",
	currentUser,
	requireAuth,
	[
		query("roomId")
			.notEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("RoomId must be provided"),
	],
	validateResult,
	async (req: Request, res: Response) => {
		const { roomId } = req.query;

		const room = await Room.findOne({ _id: roomId });

		res.status(200).send(room);
	}
);

export { router as roomRouter };
