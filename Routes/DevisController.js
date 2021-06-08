const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

const { DevisModel } = require('../Models/Model');
const { FactureModel } = require('../Models/Model');

const path = require('path');
const DLPath = path.join(__dirname, '/../Telechargements/');

//-------------------------------------------------------------

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

//var access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaW5hbmNlcyIsInNjb3BlcyI6WyJzZWxsZXIiLCJtYW5hZ2VyIl0sImV4cCI6MTYyMjYzNTQ4MX0.jnczv144P0Ua2y4mD3iGTQE4vka7mPIg0BO18BMsL4c';
// if (access_token != null) {

//     var request = require('request');
    
//     var headers = {
//         'accept': 'application/json',
//         'Authorization': 'Bearer ' + {access_token}
//     };
    
//     var options = {
//         url: 'https://ta70-sales-backend.herokuapp.com/persons/?skip=0',
//         headers: headers
//     };
    
//     function callback(error, response, body) {
//         console.log('2' + body);
//         if (!error && response.statusCode == 200) {
//             console.log(body);
//         }
//     }
    
//     request(options, callback);
// }


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

// let mailContent={
//     from: 'noreply.finances.ta70',
//     to: 'antoine.mure.am@gmail.com',
//     subject: 'First Node.js email',
//     text: 'Hi,This is a test mail sent using Nodemailer',
//     html: '<h1>COUCOU ! Voici un test</h1>',
//     attachments: [
//         {
//             filename: 'image1.jpg',
//             path: __dirname + '/image1.jpg'
//         }
//     ]
// };

// transporter.sendMail(mailContent, function(error, data){
//     if(err){
//         console.log('Unable to send mail');
//     }else{
//         console.log('Email send successfully');
//     }
// });
//------------------FIN MAIL----------------------------------------------

// const devis = new DevisModel({ client: 'Hugo', TVA: 20 });
// console.log(devis.name); // 'Silence'

// const middlewares = [
//     // ...
// bodyParser.urlencoded({ extended: true })
//
// ];

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/new', (req, res) => {

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
                //res.send(JSON.parse(body));
                res.render("newDevis", { dataClients: JSON.parse(body) });
                //console.log(body);
            }
        }
        
        request(options, callback);
    }

    // DevisModel.find((err, devis) => {
    //     if (!err) {
    //         //res.send(devis);
    //         //res.render("newDevis", { dataClients: devis });
    //         //console.log(devis[0].client);
    //     }
    //     else console.log("Error to get data : " + err);
    // })
});

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

router.get('/email/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);

    DevisModel.findById(req.params.id, (err, devis) => {
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
                        var bodyParsed = JSON.parse(body);
                        var clientTrouve = false;
                        //console.log(toto);
                        bodyParsed.forEach(element => {
                            //console.log('Nom de la BD : ' + element.first_name + ' ; Nom recherché : ' + devis.client);
                            if(element.first_name == devis.client){
                                var infos = {
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
                                var infos = {
                                    client : devis.client,
                                    email : null,
                                    objet : 'Votre devis MedicHome',
                                    message : 'Bonjour ' + devis.client + ',\n\nNous avons le plaisir de vous adresser votre devis en pièce jointe.\n\nBien cordialement,\nl\'équipe MedicHome.'
                                }
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
    
    res.redirect("/finance/devis/view");
});
// add
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

    DevisModel.findById(req.params.id, (err, devis) => {
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
        
        DevisModel.findByIdAndUpdate(
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
        
        DevisModel.findById(
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

        DevisModel.findByIdAndRemove(
            req.params.id,
            (err, docs) => {
                if (!err) res.redirect("/finance/devis/view");
                else console.log("Delete error : " + err);
            })
});


module.exports = router;