const db = require("./URLdb");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
   
app.get('/new/*', (req, res)=>{
    var url = req.url.slice(5);
    if(url.slice(0,4) !== 'http'){
        url = "https://" + url;
    }
    
    if(isURL(url)){
        db.findURL(url).then((foundResult)=>{
            if(foundResult){
                return res.send(foundResult, 200);
            }else{
                db.generateShortURL().then((shortURL)=>{
                    var urlData = {url: url, shortURL: shortURL};
                    db.addURL(urlData).then(function(result){
                        var receipt =  result.ops[0];
                        delete receipt._id;
                        receipt.shortURL = 'https://aqueous-savannah-48973.herokuapp.com/' + receipt.shortURL;
                        return res.send(receipt, 200);
                    });    
                });
                
            }
        });
        
    }else{
        return res.send({error: 'You did not use a valid url format. Try again.'}, 200);
    }
});

app.get('/*', (req, res)=>{
    var url = req.url.slice(1);
    
    db.findShortURL(url).then((foundResult)=>{
       if(foundResult){
           return res.redirect(foundResult.url);
       }else{
           return res.send({error: 'The url :' + url + ': provided is not in the database'}, 200);
       }
    });
});

app.get('/', (req, res)=>{
    return res.end('Main Page');
})

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
