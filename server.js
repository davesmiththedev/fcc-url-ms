// Define dependencies and envirnment constants
const db = require("./URLdb");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const appPath = 'https://aqueous-savannah-48973.herokuapp.com/';
// 
//START ROUTES
// 
// Route for new shortened url requests
app.get('/new/*', (req, res)=>{
    // Get the url from the request
    var url = req.url.slice(5);
    // Add http to the requrest if http not found at the start of the url
    if(url.slice(0,4) !== 'http'){
        url = "http://" + url;
    }
    
    if(isURL(url)){
        // If the url already exists return the existing document
        db.findURL(url).then((foundResult)=>{
            if(foundResult){
                foundResult.shortURL = appPath + foundResult.shortURL;
                return res.send(foundResult, 200);
            }else{
                // If the url does not exist add it to the database and
                // return the document
                db.generateShortURL().then((shortURL)=>{
                    var urlData = {url: url, shortURL: shortURL};
                    db.addURL(urlData).then(function(result){
                        var receipt =  result.ops[0];
                        delete receipt._id;
                        receipt.shortURL = appPath + receipt.shortURL;
                        return res.send(receipt, 200);
                    });    
                });
                
            }
        });
        
    }else{
        // Return an error if not a valid url
        return res.send({error: 'You did not use a valid url format. Try again.'}, 200);
    }
});

//Route for shortened url requests
app.get('/*', (req, res)=>{
    // Get the url from the request
    // var url = req.url.slice(1);
    var url = '';
    // If no url provided show main page message
    if(url == ''){
        return res.send('Main Page');
    }else{
    //If url is provided and short url is in the database redirect
    //  to the full url otherwise retrun an error
        db.findShortURL(url).then((foundResult)=>{
           if(foundResult){
               return res.redirect(foundResult.url);
           }else{
               return res.send({error: 'The url :' + url + ': provided is not in the database'}, 200);
           }
        });
    }
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
