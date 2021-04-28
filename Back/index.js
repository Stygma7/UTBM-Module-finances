const express = require('express');
const app = express();
const path = require('path');
const dirPath = path.join(__dirname, '/../Front');

require(__dirname, '../Models/dbConfig');

//const filePath = path.join(__dirname, '/../Front');

app.get('/finance', (req,res) => {
    res.sendFile(path.join(dirPath + '/finance.html'));
});

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
app.get('/add', function(req,res){
    // db.serialize(()=>{
    //     db.run('INSERT INTO emp(id,name) VALUES(?,?)', [req.body.id, req.body.name], function(err) {
    //         if (err) {
    //             return console.log(err.message);
    //         }
    //         console.log("New employee has been added");
    //         res.send("New employee has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
    //     });
    // });
    console.log("New employee has been added");
    res.send("New employee has been added into the database with ID = "+req.id+ " and Name = "+req.name);
});
app.listen(8080, () => {
    console.log("Serveur à l'écoute")
});