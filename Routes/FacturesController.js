const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

const { DevisModel } = require('../Models/Model');
const { FactureModel } = require('../Models/Model');

const path = require('path');
const DLPath = path.join(__dirname, '/../Telechargements/');

//----------------MAIL----------------------------------------------------
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'noreply.finances.ta70',
        pass: '8@9KVzbb'
    }
});

//pajazitiduresa@hotmail.com,matthieu.hirth.68@gmail.com,hugo.laurent@utbm.fr

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/new/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

    const updateRecord = {
        factureExist: true
    };
    
    DevisModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateRecord },
        { new: true },
        (err, devis) => {

            if (!err) {
                const newRecord = new FactureModel({
                    client: devis.client,
                    quantite: devis.quantite,
                    prix: devis.prix,
                    tva: devis.tva,
                    reduction: devis.reduction,
                    totalHT: devis.totalHT,
                    totalTTC: devis.totalTTC,
                    description: devis.description,
                    date: devis.date
                });
                // res.send(newRecord);
                newRecord.save((err, devi) => {
                    if (!err) res.redirect("/finance/devis/view");
                    else console.log('Erreur création nouvelles données :' + err);
                });
            }
            else console.log("Update error :" + err);
        }
    )
});

router.get('/view', (req, res) => {
    FactureModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("viewDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/email', (req, res) => {
    res.render("sendDevis");
});

router.post('/send', (req, res) => {
    console.log([DLPath + req.body.fichierDevis]);
    let mailContent={
        from: '"noreply" <noreply.finances.ta70>',
        to: req.body.emailDestinataire,
        subject: req.body.emailObjet,
        text: req.body.emailMessage,
        attachments: [
            {
                filename: req.body.fichierDevis,
                path: DLPath + req.body.fichierDevis
            }
        ]
    };
    
    transporter.sendMail(mailContent, function(error, data){
        if(error){
            console.log('Unable to send mail');
        }else{
            console.log('Email send successfully');
        }
    });
    
    res.redirect("/finance/devis/view");
});
// add
router.post('/add', (req, res) => {
    const newRecord = new FactureModel({
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
        if (!err) res.render("apercuDevis", { devi: devi });
        else console.log('Erreur création nouvelles données :' + err);
    });
});

// router.post('/factures', (req, res) => {
//     console.log("Test id devisController :",req.body.nomClient);
//     const newRecord = new FactureModel({
//         client2: req.body.nomClient,
//         TVA2: 30
//     });
//     newRecord.save((err, docs) => {
//         if (!err) res.send(docs);
//         else console.log('Erreur création nouvelles données :' + err);
//     });
// });


router.get('/apercu/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        FactureModel.findById(req.params.id, (err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("updateDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/signature/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        const updateRecord = {
            signe: true
        };
        
        FactureModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, devi) => {
                
                if (!err) res.redirect("/finance/devis/view");
                else console.log("Update error :" + err);
            }
        )
});


//update
router.post('/update/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        const updateRecord = {
            client: req.body.selectClient,
            quantite: req.body.quantite,
            prix: req.body.prix,
            tva: req.body.tva,
            reduction: req.body.reduction,
            totalHT: req.body.total_ht,
            totalTTC: req.body.total_ttc,
            description: req.body.description,
            date: req.body.date_val
        };
        
        FactureModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, devi) => {
                if (!err) res.render("apercuDevis", { devi: devi });
                else console.log("Update error :" + err);
            }
        )
});

router.get('/download/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
        
        FactureModel.findById(
            req.params.id,
            (err, devi) => {
                if (!err) res.render("apercuDevis", { devi: devi });
                else console.log("Update error :" + err);
            }
        )
});

router.get('/delete/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        FactureModel.findByIdAndRemove(
            req.params.id,
            (err, docs) => {
                if (!err) res.redirect("/finance/devis/view");
                else console.log("Delete error : " + err);
            })
});


module.exports = router;