import socket from "socket.io";
import { Server } from "http";

import { BadRequestError } from "../common/errors/bad-request-error";

let io: socket.Server;

export const init = (server: Server) => {
	io = socket(server);
	return io;
};

export const getIO = () => {
	if (!io) {
		throw new BadRequestError("Socket.io is not initialized");
	}
	return io;
};
