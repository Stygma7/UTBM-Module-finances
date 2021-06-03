const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGO_URL === undefined ? "mongodb://localhost:27017/Finance" : process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
    if (!err) console.log("Mongodb connected");
    else console.log("Connection error:" + err);
    }
   )