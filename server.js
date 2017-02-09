const port = process.env.port
const http = require("http")
const app = require("express")
// const server = http.createServer()

// server.listen(process.env.port, () => {  
// 	console.log('server is listening')
// })

// http.createServer( (request, response) => {
// 	response.writeHead(200, {
// 		"Content-type": "text/plain"
// 	})
// 	response.write("Hello")
// 	response.end
// 	console.log("request", request);
// }).listen(port)

app.get("/", (req, res) => {
	res.sendFile("index.html")
})

app.get(/^(.+)$/, (req, res) => {
	console.log('static file request : ' + req.params)
	res.sendfile( __dirname + req.params[0])
})

app.listen(port, () => {
	console.log("listening on " + port)
})