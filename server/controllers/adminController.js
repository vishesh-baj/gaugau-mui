const db = require("../config/adminModelConfig.js")
const Client = db.client;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

exports.nice = (req, res) => {
    res.json({statue:'true',message:'Controller is working...'});    
};


