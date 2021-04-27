const express = require('express')
const app = express()
const path = require('path');
const dirPath = path.join(__dirname, '/../Front');

//const filePath = path.join(__dirname, '/../Front');

app.get('/finance', (req,res) => {
    res.sendFile(path.join(dirPath + '/finance.html'));
})
app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})