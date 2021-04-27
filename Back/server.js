let http = require('http')
let fs = require('fs')

let server = http.createServer()
server.on('request', (req, res) => {
    fs.readFile('./front/finance.html', (err, data) => {
        if (err) throw err;

        res.writeHead(200, {
            'Content-type': 'text/html; charset=utf-8'
        })

        res.end(data)
    // res.send("<h4>Finance<h4>")
    // res.end(data)
    })
}) 

server.listen(8080, () => {
    console.log("Serveur à l'écoute sur http://localhost:8080/")
})