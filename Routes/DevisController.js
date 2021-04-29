const { ObjectID } = require('bson');
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

// add
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

//update
router.put("/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id)

        const updateRecord = {
            client: req.body.client,
            TVA: req.body.TVA
        };
        
        DevisModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else console.log("Update error :" + err);
            }
        )
});

router.delete("/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id)
    
    DevisModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Delete error : " + err);
        })
});


module.exports = router;