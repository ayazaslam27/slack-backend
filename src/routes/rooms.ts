import express, { Request, Response } from "express";
import { validateResult } from "../common/middleware/validate-request";
import { currentUser } from "../common/middleware/current-user";
import { requireAuth } from "../common/middleware/require-auth";
import { Room } from "../models/room";

const router = express.Router();

router.get(
	"/api/rooms",
	// currentUser,
	// requireAuth,
	validateResult,
	async (req: Request, res: Response) => {
		const rooms = await Room.find();

		res.send(rooms);
	}
);

export { router as getRoomsRouter };
