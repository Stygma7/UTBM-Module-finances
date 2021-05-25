const express = require('express');
const app = express();
const path = require('path');
const dirPath = path.join(__dirname, '/../views');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const DevisController = require('../Routes/DevisController');
const DashboardController = require('../Routes/DashboardController');

// set the view engine to ejs
app.set('view engine', 'ejs');


const middlewares = [
  // ...
  bodyParser.urlencoded({ extended: true })
];
app.use(middlewares);
app.use('/finance/devis', DevisController);
app.use('/finance/dashboard', DashboardController);



require('../Models/dbConfig');
require('../Routes/DevisController');

app.get('/finance', (req,res) => {
    res.render("accueil");
});




mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());

app.listen(8080, () => {
    console.log("Serveur à l'écoute : http://localhost:8080/finance")
});