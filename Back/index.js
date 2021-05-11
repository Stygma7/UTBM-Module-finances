const express = require('express');
const app = express();
const path = require('path');
const dirPath = path.join(__dirname, '/../views');
const bodyParser = require('body-parser');


// set the view engine to ejs
app.set('view engine', 'ejs');


const middlewares = [
  // ...
  bodyParser.urlencoded({ extended: true })
];
app.use(middlewares);

require('../Models/dbConfig');
require('../Routes/DevisController');

// app.get('/', (req,res) => {
//     res.render("finance", { username1: 'aa', username2: 'Duresa', username3: 'Matthieu', username4: 'Hugo' });
// });


const DevisRoutes = require('../Routes/DevisController');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const cors = require('cors');

mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());

//app.use(cors({origin: 'https://localhost:3000'}));
app.use('/', DevisRoutes);

// app.get('/finance', (req,res) => {
//     res.sendFile(path.join(dirPath + '/finance.ejs'));
// });

// app.get('/dashboard', (req,res) => {
//     res.sendFile(path.join(dirPath + '/dashboard.html'));
// });

app.get('/view/:id', function(req,res){
    // db.serialize(()=>{
    //     db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
    //         if(err){
    //             res.send("Error encountered while displaying");
    //             return console.error(err.message);
    //         }
    //         res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
    //         console.log("Entry displayed successfully");
    //     });
    // });
    //res.send(` ID: `+req.params.id);
    console.log("Entry displayed successfully ");
});

// Insert
// app.get('/add', function(req,res){
//     // db.serialize(()=>{
//     //     db.run('INSERT INTO emp(id,name) VALUES(?,?)', [req.body.id, req.body.name], function(err) {
//     //         if (err) {
//     //             return console.log(err.message);
//     //         }
//     //         console.log("New employee has been added");
//     //         res.send("New employee has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
//     //     });
//     // });
//     console.log("New employee has been added");
//     res.send("New employee has been added into the database with ID = "+req.id+ " and Name = "+req.name);
// });
app.listen(8080, () => {
    console.log("Serveur à l'écoute : http://localhost:8080/finance")
});