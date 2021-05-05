const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

// const { DevisModel } = require('/Users/Duresa/Desktop/Site web/Finance/UTBM-Module-finances/Models/DevisModel');
const { DevisModel } = require('../Models/DevisModel');

// const devis = new DevisModel({ client: 'Hugo', TVA: 20 });
// console.log(devis.name); // 'Silence'

// const middlewares = [
//     // ...
// bodyParser.urlencoded({ extended: true })
//
// ];

app.use(bodyParser.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("finance", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

// add
router.post('/', (req, res) => {
    console.log([req.body.nomClient]);
    console.log("Test id devisController :",req.body.id)
    const newRecord = new DevisModel({
        client: req.body.id,
        TVA: 30
    });

    newRecord.save((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Erreur création nouvelles données :' + err);
    })
});

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