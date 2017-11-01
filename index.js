const express = require('express')
const app = express()
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser')
const cors = require('cors')
mongoose.connect(config.uri, { useMongoClient: true },(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Connected to database '+config.db);
    }
});
mongoose.Promise = global.Promise;
app.use(cors({
    origin:'http://localhost:4200'
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname+'/client/dist/'));
app.use('/aut',authentication);
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname +'/client/dist/index.html'));
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})