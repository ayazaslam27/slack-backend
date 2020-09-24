import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import { NotFoundError } from "./common/errors/not-found-error";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { init } from "./services/socket";
import { Socket } from "socket.io";

import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { createRoomRouter } from "./routes/new-room";
import { createMessageRouter } from "./routes/new-message";
import { getRoomsRouter } from "./routes/rooms";
import { roomRouter } from "./routes/room";

const app = express();

app.set("trust proxy", true);

app.use(
	cors({
		credentials: true,
		origin: "https://slack-clone-frontend.herokuapp.com",
	})
);

app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
		sameSite: "lax",
	})
);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(createRoomRouter);
app.use(createMessageRouter);
app.use(getRoomsRouter);
app.use(roomRouter);

app.all("*", async (req, res) => {
	throw new NotFoundError();
});

dotenv.config();

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}

	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		await mongoose
			.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
			})
			.then((result) => {
				const port = process.env.PORT || 3000;
				const server = app.listen(port, () => {
					console.log(`Listening on port ${port}`);
				});

				const io = init(server);

				io.on("connection", (socket: Socket) => {
					console.log("Socket.io is ready");
				});
			});

		console.log("Connected to mongodb");
	} catch (err) {
		console.log(err);
	}
};

start();
