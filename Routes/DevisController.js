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
const DLPath = path.join(__dirname, '/../uploads/');


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
router.get('/new', (req, res) => {

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
            res.render("newDevis", { dataClients: JSON.parse(body) });
        }
    }
    
    request(options, callback);

});


//----------------/view----------------------------------------------------//
router.get('/view', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("viewDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});


//----------------------------/email----------------------------------------//
router.get('/email/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);

    DevisModel.findById(req.params.id, (err, devis) => {
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
                        isDevis : true,
                        client : devis.client,
                        email : null,
                        objet : 'Votre devis MedicHome',
                        message : 'Bonjour ' + devis.client + ',\n\nNous avons le plaisir de vous adresser votre devis en pièce jointe.\n\nBien cordialement,\nl\'équipe MedicHome.'
                    }
                    //console.log(toto);
                    toto.forEach(element => {
                        //console.log('Nom de la BD : ' + element.first_name + ' ; Nom recherché : ' + devis.client);
                        if(element.first_name == devis.client){
                            infos = {
                                isDevis : true,
                                client : devis.client,
                                email : element.email,
                                objet : 'Votre devis MedicHome',
                                message : 'Bonjour ' + devis.client + ',\n\nNous avons le plaisir de vous adresser votre devis en pièce jointe.\n\nBien cordialement,\nl\'équipe MedicHome.'
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
            
            //console.log(devis[0].client);
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
    
    res.redirect("/finance/devis/view");
});


//----------------/add----------------------------------------------------//
router.post('/add', (req, res) => {
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
    newRecord.save((err, devi) => {
        if (!err) {
            res.redirect("/finance/devis/download/" + devi.id);
        } 
        else console.log('Erreur création nouvelles données :' + err);
    });
});


//----------------/apercu----------------------------------------------------//
router.get('/apercu/:id', (req, res) => {
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


//----------------/signature----------------------------------------------------//
router.get('/signature/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        const updateRecord = {
            signe: true
        };
        
        DevisModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, devi) => {
                
                if (!err) res.redirect("/finance/devis/view");
                else console.log("Update error :" + err);
            }
        )
});


//----------------/update----------------------------------------------------//
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
        
        DevisModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, devi) => {
                if (!err) res.redirect("/finance/devis/download/" + devi.id);
                else console.log("Update error :" + err);
            }
        )
});


//----------------/download----------------------------------------------------//
router.get('/download/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
        
        DevisModel.findById(
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
                                isDevis : true,
                                devis : devi,
                                adresseClient : null,
                                emailClient : null,
                                telephoneClient : null
                            }
                            //console.log(toto);
                            toto.forEach(element => {
                                //console.log('Nom de la BD : ' + element.first_name + ' ; Nom recherché : ' + devis.client);
                                if(element.first_name == devi.client){
                                    infos = {
                                        isDevis : true,
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

                }
                else console.log("Download error :" + err);
            }
        )
});


//----------------/delete----------------------------------------------------//
router.get('/delete/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        DevisModel.findByIdAndRemove(
            req.params.id,
            (err, docs) => {
                if (!err) res.redirect("/finance/devis/view");
                else console.log("Delete error : " + err);
            })
});


module.exports = router;