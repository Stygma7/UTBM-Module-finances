const { ObjectID } = require('bson');
const express = require('express');

const multer = require('multer');
const uuid = require('uuid').v4;
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})
const upload = multer({ storage });

const app = express();
const bodyParser = require('body-parser');

const { DevisModel } = require('../Models/Model');
const { FactureModel } = require('../Models/Model');

const path = require('path');
const DLPath = path.join(__dirname, '/../Telechargements/');

//----------------MAIL----------------------------------------------------//
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'noreply.finances.ta70',
        pass: '8@9KVzbb'
    }
});


app.use(bodyParser.urlencoded({ extended: true }));


//----------------/new----------------------------------------------------//
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
                newRecord.save((err, devi) => {
                    if (!err) res.redirect("/finance/facture/view");
                    else console.log('Erreur création nouvelles données :' + err);
                });
            }
            else console.log("Update error :" + err);
        }
    )
});


//----------------/view----------------------------------------------------//
router.get('/view', (req, res) => {
    FactureModel.find((err, factures) => {
        if (!err) {
            res.render("viewFactures", { factures : factures });
        }
        else console.log("Error to get data : " + err);
    })
});


//----------------/email----------------------------------------------------//
router.get('/email/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);

    FactureModel.findById(req.params.id, (err, facture) => {
        if (!err) {
            
            if (access_token == null) res.redirect("/finance"); // redirect to home page to get the token

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
                        objet : 'Votre facture MedicHome',
                        message : 'Bonjour ' + facture.client + ',\n\nNous avons le plaisir de vous adresser votre facture en pièce jointe.\n\nBien cordialement,\nl\'équipe MedicHome.'
                    }
                    toto.forEach(element => {
                        if(element.first_name == facture.client){
                            infos = {
                                isDevis : false,
                                client : facture.client,
                                email : element.email,
                                objet : 'Votre facture MedicHome',
                                message : 'Bonjour ' + facture.client + ',\n\nNous avons le plaisir de vous adresser votre facture en pièce jointe.\n\nBien cordialement,\nl\'équipe MedicHome.'
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
            
            
        } else console.log("Error to get data : " + err);
    })
});


//----------------emailRappel----------------------------------------------------//
router.get('/emailRappel/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);

    FactureModel.findById(req.params.id, (err, facture) => {
        if (!err) {

            if (access_token == null) res.redirect("/finance"); // redirect to home page to get the token

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
                    toto.forEach(element => {
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
            
        } else console.log("Error to get data : " + err);
    })
});


//----------------/send----------------------------------------------------//
router.post('/send', upload.single('avatar'), (req, res) => {

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


//----------------/paye----------------------------------------------------//
router.get('/paye/:id', (req, res) => {
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


//----------------download----------------------------------------------------//
router.get('/download/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
        
        FactureModel.findById(
            req.params.id,
            (err, devi) => {
                if (!err) {

                    if (access_token == null) res.redirect("/finance"); // redirect to home page to get the token

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
                                devis : devi,
                                adresseClient : null,
                                emailClient : null,
                                telephoneClient : null
                            }
                            toto.forEach(element => {
                                if(element.first_name == devi.client){
                                    infos = {
                                        isDevis : false,
                                        devis : devi,
                                        adresseClient : element.street + ', ' + element.postal_code + ' ' + element.city + ', ' + element.country,
                                        emailClient : element.email,
                                        telephoneClient : element.phone
                                    }
                                    res.render("apercuDevis", { infos: infos });
                                    clientTrouve = true;
                                }
                            });
                                if (!clientTrouve){
                                    res.render("apercuDevis", { infos: infos });
                                }
                        } else console.log('erreur');
                    }
                    
                    request(options, callback);

                } else console.log("Download error :" + err);
            }
        )
});


//----------------delete----------------------------------------------------
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