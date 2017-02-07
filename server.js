const WebSocket = require('ws');

const wss = new WebSocket.Server({
	perMessageDeflate: false,
	port: 80
});