// Define dependencies and environment constants
const routes = require('./app/routes/routes.js');
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongo = require("mongodb").MongoClient;
const dbURL = process.env.MONGO_DBURL || 'mongodb://localhost:27017/URLdb';

mongo.connect(dbURL, (err, db)=>{
    // Report error or success connecting to database
    if(err){
        throw new Error('Failed to connect to database :(');
    }else{
        console.log('Connected to database on port 27017 :)');
    }
    
    routes(app, db);
});

/*START SERVER*/
app.listen(port, ()=>{
    console.log('Listening on port ' + port);
});

