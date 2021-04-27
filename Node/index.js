const express = require('express')
const app = express()

app.get('/finance', (req,res) => {
    res.send("<h4>Finance<h4>")
})

app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})