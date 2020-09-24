import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { NotFoundError } from "../common/errors/not-found-error";
import { currentUser } from "../common/middleware/current-user";
import { requireAuth } from "../common/middleware/require-auth";
import { validateResult } from "../common/middleware/validate-request";
import { Message, Room } from "../models/room";
import { getIO } from "../services/socket";
// import { Message } from "../models/message.ts.old";

const router = express.Router();

router.post(
	"/api/message/create",
	currentUser,
	requireAuth,
	[
		body("roomId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("RoomId must be provided"),
		body("message").not().isEmpty().withMessage("message is required"),
		body("user").not().isEmpty().withMessage("user name is required"),
	],
	validateResult,
	async (req: Request, res: Response) => {
		const { roomId, message, user, userImage, timeStamp } = req.body;

		// const room = await Room.findById(roomId);
		const newMessage: Message = {
			user,
			message,
			timeStamp,
			userImage,
		};

		const room = await Room.findOneAndUpdate(
			{ _id: roomId },
			{ $push: { messages: newMessage } },
			{ new: true }
		).exec();

		if (!room) {
			throw new NotFoundError();
		}

		getIO().emit("message", {
			action: "new-message",
			data: room,
		});
		res.status(201).send(room);
	}
);

export { router as createMessageRouter };
