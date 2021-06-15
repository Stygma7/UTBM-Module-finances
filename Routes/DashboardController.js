const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

const { DevisModel } = require('../Models/Model');
const { FactureModel } = require('../Models/Model');

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            FactureModel.find((err, factures) => {
                if (!err) {
                    res.render("dashboard", { devis: devis, factures: factures });
                }
                else console.log("Error to get data : " + err);
            });
        }
        else console.log("Error to get data : " + err);
    });
});

module.exports = router;