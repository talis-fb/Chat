import mongoose,{ Document } from 'mongoose'
const Schema = mongoose.Schema;

interface IMessage extends Document {
    from: string,
    body: string
}
const Message = new Schema<IMessage>({
	from: { type: String, required: true },
	body: String,
})

interface IMessageSchema extends Document {
    cod: string,
    members: string[],
    messages: IMessage[]
}
const MessagesSchema = new Schema<IMessageSchema>({
	cod: {
		type: String,
		require: true
	},
	members: [String],
	messages: [Message]
});

export default mongoose.model<IMessageSchema>('Messages', MessagesSchema);
