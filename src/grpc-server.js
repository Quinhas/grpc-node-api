const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./src/messages.proto", {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const messagesProto = grpc.loadPackageDefinition(packageDefinition).messages;

const fakeDatabase = {};

const server = new grpc.Server();

server.addService(messagesProto.MessageService.service, {
	GetMessage: (call, callback) => {
		const id = call.request.id;
		if (!fakeDatabase[id]) {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Message not found",
			});
			return;
		}
		callback(null, fakeDatabase[id]);
	},
	CreateMessage: (call, callback) => {
		const input = call.request.input;
		const id = require("crypto").randomBytes(10).toString("hex");
		fakeDatabase[id] = {
			id,
			...input,
		};
		callback(null, fakeDatabase[id]);
	},
	UpdateMessage: (call, callback) => {
		const id = call.request.id;
		if (!fakeDatabase[id]) {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Message not found",
			});
			return;
		}
		const input = call.request.input;
		fakeDatabase[id] = {
			id,
			...input,
		};
		callback(null, fakeDatabase[id]);
	},
});

server.bindAsync(
	"127.0.0.1:50051",
	grpc.ServerCredentials.createInsecure(),
	() => {
		console.log("gRPC server running at http://127.0.0.1:50051");
		server.start();
	}
);
