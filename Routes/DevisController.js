const express = require('express');
const router = express.Router();

// const { DevisModel } = require('/Users/Duresa/Desktop/Site web/Finance/UTBM-Module-finances/Models/DevisModel');
const { DevisModel } = require('../Models/DevisModel');

router.get('/', (req, res) => {
    DevisModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : " + err);
    })
});

router.post('/', (req, res) => {
    console.log(req.body);
    const newRecord = new DevisModel({
    client: req.body.client,
    TVA: req.body.TVA
});

    newRecord.save((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Erreur création nouvelles données :' + err);
    })
})

module.exports = router;