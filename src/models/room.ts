import mongoose, { Types } from "mongoose";
// import { MessageDoc } from "./message.ts.old";

export interface Message {
	user: string;
	message: string;
	timeStamp: Date;
	userImage: string;
}

interface RoomAttrs {
	name: string;
	messages: Message[];
}

interface RoomModel extends mongoose.Model<RoomDoc> {
	build(attrs: RoomAttrs): RoomDoc;
}

// An interface that describes the properties that
// a User document has

interface RoomDoc extends mongoose.Document {
	name: string;
	messages: Message[];
}

const roomSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},

		messages: {
			type: Array,
			required: false,
		},
	},
	{
		toJSON: {
			transform(ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

roomSchema.statics.build = (attrs: RoomAttrs) => {
	return new Room(attrs);
};

const Room = mongoose.model<RoomDoc, RoomModel>("Room", roomSchema);

export { Room };
