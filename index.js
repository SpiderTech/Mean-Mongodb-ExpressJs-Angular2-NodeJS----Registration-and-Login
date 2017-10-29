const express = require('express')
const app = express()
const mongoose = require('mongoose');
const config = require('./config/database');
mongoose.connect(config.uri, { useMongoClient: true },(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Connected to database '+config.db);
    }
});
mongoose.Promise = global.Promise;
app.get('*', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})