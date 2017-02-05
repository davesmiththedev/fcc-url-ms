require('dotenv').load();
var user = process.env.MONGO_USERNAME;
var pass = process.env.MONGO_PASSWORD;
const mongo = require("mongodb").MongoClient;
const dbURL = 'mongodb://'+ user +':' + pass + '@ds135039.mlab.com:35039/url-db'
// const dbURL = 'mongodb://localhost:27017/URLdb'


function highestShortURL(){
        return mongo.connect(dbURL).then((db)=>{
           return db.collection('urls').findOne({$query:{}, $orderby:{shortURL: -1}}); 
        });
    }

module.exports = {
    addURL: function(urlData){
     return mongo.connect(dbURL).then((db)=>{
         
         return db.collection('urls').insert(urlData);
         
     });   
    },
    
    findShortURL: function(url){
        return mongo.connect(dbURL).then((db)=>{
            return db.collection('urls').findOne({shortURL: url}, {_id: 0, url: 1});
        });   
    },
    
    findURL: function(url){
        return mongo.connect(dbURL).then((db)=>{
            return db.collection('urls').findOne({url: url}, {_id: 0});
        });
    },
    
    generateShortURL: function(){
       return highestShortURL().then((highest)=>{
           var increment = parseInt(highest.shortURL.slice(44)) + 1;
           return 'https://boiling-retreat-83230.herokuapp.com/' + increment;    
       }); 
            
    }
    
};

