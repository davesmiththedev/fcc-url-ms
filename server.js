// Define dependencies and environment constants
const api = require("./URLdb");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const appPath = 'https://aqueous-savannah-48973.herokuapp.com/';
const mongo = require("mongodb").MongoClient;
const dbURL = process.env.MONGO_DBURL || 'mongodb://localhost:27017/URLdb';

mongo.connect(dbURL, (err, db)=>{
    // Report error or success connecting to database
    if(err){
        throw new Error('Failed to connect to database :(');
    }else{
        console.log('Connected to database on port 27017 :)');
    }
    // 
    //START ROUTES
    // 
    // Route for new shortened url requests
    app.get('/new/*', (req, res)=>{
        // Get the url from the request
        var url = req.url.slice(5);
        // Add http to the request if http not found at the start of the url
        if(url.slice(0,4) !== 'http'){
            url = "http://" + url;
        }
        
        if(isURL(url)){
            // If the url already exists return the existing document
            api.findURL(url, db).then((foundResult)=>{
                if(foundResult){
                    foundResult.shortURL = appPath + foundResult.shortURL;
                    return res.status(200).send(foundResult);
                }else{
                    // If the url does not exist add it to the database and
                    // return the document
                    api.generateShortURL(db).then((shortURL)=>{
                        var urlData = {url: url, shortURL: shortURL};
                        api.addURL(urlData, db).then(function(result){
                            var receipt =  result.ops[0];
                            delete receipt._id;
                            receipt.shortURL = appPath + receipt.shortURL;
                            return res.status(200).send(receipt);
                        });    
                    });
                    
                }
            });
            
        }else{
            // Return an error if not a valid url
            return res.status(200).send({error: 'You did not use a valid url format. Try again.'});
        }
    });
    
    //Route for shortened url requests
    app.get('/*', (req, res)=>{
        // Get the url from the request
        var url = req.url.slice(1);
        // If no url provided show homepage
        if(url == ''){
            return res.sendFile(path.join(__dirname + '/home.html'));
        }else{
        //If url is provided and short url is in the database redirect
        //  to the full url otherwise retrun an error
            api.findShortURL(url, db).then((foundResult)=>{
               if(foundResult){
                   return res.redirect(foundResult.url);
               }else{
                   return res.status(200).send({error: 'The url :' + url + ': provided is not in the database'});
               }
            });
        }
    });
});
/*START SERVER*/
app.listen(port, ()=>{
    console.log('Listening on port ' + port);
});

//verify str value is a valid url
function isURL(str){
    var urlPattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    if(urlPattern.exec(str)){
        return true;
    }else{
        return false;
    }
};
