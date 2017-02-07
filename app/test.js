const WebSocket = require('ws');

const ws = new WebSocket('ws://asbjorn.gear.host', {
	perMessageDeflate: false
});

console.log(ws);