function highestShortURL(db){
        return db.collection('urls').find({}).sort({'shortURL': -1}).limit(1).next();
    }

module.exports = {
    addURL: function(newURLObject, db){
     return db.collection('urls').insert(newURLObject);
    },
    
    findShortURL: function(url, db){
        return db.collection('urls').findOne({shortURL: parseInt(url)}, {_id: 0, url: 1});
    },
    
    findURL: function(url, db){
        return db.collection('urls').findOne({url: url}, {_id: 0});
    },
    
    generateShortURL: function(db){
       return highestShortURL(db).then((highest)=>{
           var increment = parseInt(highest.shortURL) + 1;
           return increment;    
       }); 
    }
};

