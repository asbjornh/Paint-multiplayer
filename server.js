const http = require("http")
// const server = http.createServer()  

// server.listen(process.env.port, () => {  
// 	console.log('server is listening')
// })

http.createServer( (request, response) => {
	response.writeHead(200, {
		"Content-type": "text/plain"
	})
	response.write("Hello")
	response.end
}).listen(process.env.port)