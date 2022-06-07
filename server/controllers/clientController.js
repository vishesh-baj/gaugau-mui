const db = require("../config/adminModelConfig.js")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Client = db.client;
var _ = require('lodash');
const { Validator } = require('node-input-validator');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


exports.addClient = async (req, res) => {
    let dataValue = req.body;
    for (const prop in dataValue) {
        if(_.isEmpty(dataValue[prop])){
            return res.json({
                status: "False",
                message: "Something is Missing In Object"
            })
        }
    }

    Client.create({
        client_name:dataValue.client_name,
        mobile_number:dataValue.mobile_number,
        descriptions:dataValue.descriptions,
        email:'NA',
        delete_status:'0',
        status:'0',
        delete_status:'0'
    }).then( result => {
        return res.status(200).json({'Status':'True','Message':'Data Inserted Successfully','data':result});
    }).catch( err => {
        return res.status(401).json({'Status':'False','Error':err});
    });
};

exports.editClient = async (req, res) => {
    var data = await Client.findOne({where:{id:req.params.id}});
    res.json({status:'True',Message:data});
};

exports.updateClient = async (req, res) => {
    var data = req.body;
    for (const prop in data) {
        if(_.isEmpty(data[prop])){
            return res.json({
                status: "False",
                message: "Something is Missing In Field"
            })
        }
    }
    var updateData = {
        client_name:data.client_name,
        mobile_number:data.mobile_number,
        descriptions:data.descriptions
    };
    await Client.update(updateData,{where:{id:req.params.id}}).then( result => {
        return res.status(200).json({status:'True',Message:'Data Updated Successfully.'});
    }).catch( err => {
        return res.status(401).json({status:'False',Error:err});
    });
};

exports.deleteClient = async (req, res) => {
    var data = {status : '-1'}
    await Client.update(data, { where: {id:req.params.id}}).then( () => {
        return res.status(200).json({'Status':'True','Message':'Data Deleted Successfully.'});
    }).catch( err => {
        return res.status(401).json({'Status':'False','Error':err});
    });
};

exports.getClient = async (req, res) => {
    await Client.findAll({where:{status:{[Op.not]: '-1'}}}).then( data => {
        res.json({status:'True',Message:'Data Found Successfully',Data:data});
    }).catch( err => {
        res.json({status:'False',Message:'Data Not Found'});    
    });
};
