const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

const { DevisModel } = require('../Models/Model');
const { FactureModel } = require('../Models/Model');

const path = require('path');
const DLPath = path.join(__dirname, '/../Telechargements/');

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

var access_token;

function callback_token(error, response, body) {
    if (!error && response.statusCode == 200) {
        var rep = JSON.parse(body);
        access_token = rep.access_token;
        console.log(access_token);
    }
}

request(options, callback_token);

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
                    if (!err) res.redirect("/finance/facture/view");
                    else console.log('Erreur création nouvelles données :' + err);
                });
            }
            else console.log("Update error :" + err);
        }
    )
});

router.get('/view', (req, res) => {
    FactureModel.find((err, factures) => {
        if (!err) {
            // res.send(docs);
            res.render("viewFactures", { factures : factures });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/email/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);

    FactureModel.findById(req.params.id, (err, facture) => {
        if (!err) {
            // res.send(docs);
            if (access_token != null) {

                var request = require('request');
                
                var headers = {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                };
                
                var options = {
                    url: 'https://ta70-sales-backend.herokuapp.com/persons/?skip=0',
                    headers: headers
                };
                
                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var toto = JSON.parse(body);
                        var clientTrouve = false;
                        var infos = {
                            isDevis : false,
                            client : facture.client,
                            email : null,
                            objet : 'URGENT : Rappel facture MedicHome',
                            message : 'Bonjour ' + facture.client + ',\n\nNous sommes au regret de vous informer que votre facture arrivera à échéance de paiement dans moins de 10 jour.\nNous vous demandons donc de procéder au paiement de votre facture dans les plus brefs délais.\n\nBien cordialement,\nl\'équipe MedicHome.'
                        }
                        //console.log(toto);
                        toto.forEach(element => {
                            //console.log('Nom de la BD : ' + element.first_name + ' ; Nom recherché : ' + devis.client);
                            if(element.first_name == facture.client){
                                infos = {
                                    isDevis : false,
                                    client : facture.client,
                                    email : element.email,
                                    objet : 'URGENT : Rappel facture MedicHome',
                                    message : 'Bonjour ' + facture.client + ',\n\nNous sommes au regret de vous informer que votre facture arrive à échéance de paiement dans moins de 10 jour.\nNous vous demandons donc de procéder au paiement de votre facture dans les plus brefs délais.\n\nBien cordialement,\nl\'équipe MedicHome.'
                                }
                                res.render("sendDevis", { infos: infos });
                                clientTrouve = true;
                            }
                        });
                            if (!clientTrouve){
                                res.render("sendDevis", { infos: infos });
                            }
                    } else console.log('erreur');
                }
                
                request(options, callback);
            }
            
            //console.log(devis[0].client);
        } else console.log("Error to get data : " + err);
    })
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
    
    res.redirect("/finance/facture/view");
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
            paye: true
        };
        
        FactureModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, devi) => {
                
                if (!err) res.redirect("/finance/facture/view");
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
                if (!err) res.redirect("/finance/facture/view");
                else console.log("Delete error : " + err);
            })
});


module.exports = router;