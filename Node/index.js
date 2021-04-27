const express = require('express')
const app = express()
var path = require('path');

app.get('/finance', (req,res) => {
    res.send("<h4>Finance<h4>")
})

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../develop_Form/toto.html'));
});

app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})