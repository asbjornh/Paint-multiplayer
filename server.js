const port = process.env.port || 3000

const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)


app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

app.get(/^(.+)$/, (req, res) => {
	console.log('static file request : ' + req.params[0])
	res.sendFile( __dirname + req.params[0])
})

io.on("connection", (socket) => {
	console.log("user connected to socket")

	socket.on("userinput", (data) => {
		console.log(data)
		io.emit("userinput", data);
	})
})

http.listen(port, () => {
	console.log("listening on " + port)
})