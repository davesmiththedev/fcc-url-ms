const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get('/:url', (req, res)=>{
    res.end(req.params.url);
    
});

app.get('/', (req, res)=>{
    res.end('Please add an url parameter');
});

app.listen(port, ()=>{
    console.log('Listening on port ' + port);
});