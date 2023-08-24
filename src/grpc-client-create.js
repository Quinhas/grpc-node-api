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
const createMessageInput = { content: "Outra mensagem", author: "Autor 2" };
client.CreateMessage({ input: createMessageInput }, (error, response) => {
	if (!error) {
		console.log("CreateMessage Response:", response);
	} else {
		console.error("Error:", error.message);
	}
});
