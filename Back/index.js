const express = require('express');
const app = express();
const path = require('path');
const dirPath = path.join(__dirname, '/../views');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const DevisController = require('../Routes/DevisController');
const DashboardController = require('../Routes/DashboardController');
const FacturesController = require('../Routes/FacturesController');

// set the view engine to ejs
app.set('view engine', 'ejs');


const middlewares = [
  // ...
  bodyParser.urlencoded({ extended: true })
];
app.use(middlewares);
app.use('/finance/devis', DevisController);
app.use('/finance/dashboard', DashboardController);
app.use('/finance/facture', FacturesController);



require('../Models/dbConfig');
require('../Routes/DevisController');


global.access_token = null;

app.get('/finance', (req,res) => {
    var request = require('request');

    var headers = {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    var dataString = 'grant_type=&username=finances&password=finances!&scope=seller%20manager&client_id=&client_secret=';

    var options = {
        url: 'https://ta70-sales-backend.herokuapp.com/security/token',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    async function callback_token(error, response, body) {
        if (!error && response.statusCode == 200) {
            var rep = JSON.parse(body);
            access_token = rep.access_token;
            console.log(access_token);
        }
    }

    request(options, callback_token);



    res.render("accueil");
});




mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());

app.listen(8080, () => {
    console.log("Serveur à l'écoute : http://localhost:8080/finance")
});