const mongo = require("mongodb").MongoClient;
const dbURL = 'mongodb://localhost:27017/URLdb'

module.exports = {
    addURL: function(urlData){
     return mongo.connect(dbURL).then(function(db){
         
         return db.collection('urls').insert(urlData);
         
     });   
    },
    
    findShortURL: function(url){
        return mongo.connect(dbURL).then(function(db){
            return db.collection('urls').findOne({shortURL: url}, {_id: 0, url: 1});
        });   
    },
    
    findURL: function(url){
        return mongo.connect(dbURL).then((db)=>{
            return db.collection('urls').findOne({url: url}, {_id: 0});
        });
    }
    
};

