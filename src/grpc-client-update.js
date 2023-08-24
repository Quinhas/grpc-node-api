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

const client = new messagesProto.MessageService(
	"127.0.0.1:50051",
	grpc.credentials.createInsecure()
);

// Make gRPC calls using client methods
const updateMessageInput = { content: "Content", author: "Autor 2" };
client.UpdateMessage(
	{ id: "7c3d32722ac29113bbed", input: updateMessageInput },
	(error, response) => {
		if (!error) {
			console.log("UpdateMessage Response:", response);
		} else {
			console.error("Error:", error.message);
		}
	}
);
