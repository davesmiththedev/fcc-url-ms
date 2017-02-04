const db = require("./URLdb");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
   
app.get('/*', (req, res)=>{
    var url = req.url.slice(1);
    
    if(isURL(url)){
        console.log('It\'s a URL :)');
        
        db.findURL(url).then((foundResult)=>{
            if(foundResult){
                console.log('url:' + JSON.stringify(foundResult));
                return res.send(foundResult, 200);
            }else{
                var urlData = {url: url};
                urlData.shortURL = '123';
                console.log('add:' + JSON.stringify(urlData));
                db.addURL(urlData).then(function(result){
                    var receipt =  result.ops[0];
                    delete receipt._id;
                    return res.send(receipt, 200);
                });
            }
        });
        
    }else{
        console.log('Not a URL :(');
        
         db.findShortURL(url).then((foundResult)=>{
           if(foundResult){
               console.log('shortURL:' + foundResult.url);
               return res.redirect(foundResult.url);
               
           }else{
               
                return res.send('You did not enter a valid url', 200);
                
           }
        });
        
    }
});

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

//Generate a random short url
function randomShortURL(){
    //generate random url verify against urls collection
};