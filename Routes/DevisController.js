const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

// const { DevisModel } = require('/Users/Duresa/Desktop/Site web/Finance/UTBM-Module-finances/Models/DevisModel');
const { DevisModel } = require('../Models/DevisModel');
const { FactureModel } = require('../Models/DevisModel');

// const devis = new DevisModel({ client: 'Hugo', TVA: 20 });
// console.log(devis.name); // 'Silence'

// const middlewares = [
//     // ...
// bodyParser.urlencoded({ extended: true })
//
// ];

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/devis/new', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("finance", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/devis/view', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("viewDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/dashboard', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("dashboard", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});
// add
router.post('/devis/add', (req, res) => {
    console.log([req.body.description]);
    console.log("Test id devisController :",req.body.selectClient)
    const newRecord = new DevisModel({
        client: req.body.selectClient,
        quantite: req.body.quantite,
        prix: req.body.prix,
        tva: req.body.tva,
        reduction: req.body.reduction,
        totalHT: req.body.total_ht,
        totalTTC: req.body.total_ttc,
        description: req.body.description,
        date: req.body.date_val
    });
    // res.send(newRecord);
    newRecord.save((err, devi) => {
        if (!err) res.render("apercu_devis", { devi: devi });
        else console.log('Erreur création nouvelles données :' + err);
    });
});

router.post('/factures', (req, res) => {
    console.log("Test id devisController :",req.body.nomClient);
    const newRecord = new FactureModel({
        client2: req.body.nomClient,
        TVA2: 30
    });
    newRecord.save((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Erreur création nouvelles données :' + err);
    });
});


router.get('/devis/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

    DevisModel.findById(req.params.id, (err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("updateDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});


//update
router.post('/devis/update/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        const updateRecord = {
            // client: req.body.selectClient,
            quantite: req.body.quantite,
            prix: req.body.prix,
            tva: req.body.tva,
            reduction: req.body.reduction,
            totalHT: req.body.total_ht,
            totalTTC: req.body.total_ttc,
            description: req.body.description,
            date: req.body.date_val
        };
        
        DevisModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, docs) => {
                if (!err) res.redirect("/devis/view");
                else console.log("Update error :" + err);
            }
        )
});

router.delete("/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
    
    DevisModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Delete error : " + err);
        })
});


module.exports = router;