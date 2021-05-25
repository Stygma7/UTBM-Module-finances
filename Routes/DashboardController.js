const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

const { DevisModel } = require('../Models/DevisModel');

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("dashboard", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

module.exports = router;