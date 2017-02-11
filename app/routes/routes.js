const api = require("../api/URLdb");
const appPath = 'https://aqueous-savannah-48973.herokuapp.com/';
const path = require('path');

module.exports = function(app, db){
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
                    // prepend the app path to shortURL
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
            return res.status(400).send({error: 'You did not use a valid url format. Try again.'});
        }
    });
    
    //Route for shortened url requests
    app.get('/*', (req, res)=>{
        // Get the url from the request
        var url = req.url.slice(1);
        // If no url provided show homepage
        if(url == ''){
            var fileName = path.resolve(__dirname, '../../views/home.html');
            return res.sendFile(fileName);
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
}

//verify str value is a valid url
function isURL(str){
    var urlPattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    if(urlPattern.exec(str)){
        return true;
    }else{
        return false;
    }
};