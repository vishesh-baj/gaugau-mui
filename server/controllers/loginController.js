const db = require("../config/adminModelConfig.js");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const adminModel = db.admin;
const clientModel = db.client;
const customerModel = db.customer;
const campaignModel = db.campaigns;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

exports.adminData = async (req, res) => {
    await adminModel.findAll().then((data)=> {
        res.json({status:'True', Message:data});
    }).catch(err => {
        res.json({status:'False',Message:'Error'+err});    
    });
};

exports.dashboardCount = async (req, res) => {
    const clientData = customerData = '';
    const result = [];
    
    await clientModel.findAndCountAll({where:{status:{[Op.not]: '-1'}}}).then((countClient)=> {
        //clientData = res.json({status:'True',clientMessage:countClient.count});
        result.push({clientCount:countClient.count});
    }).catch(err => {
        clientData = res.json({clientMessage:'Error'+err});    
    });
    await customerModel.findAndCountAll({}).then((countCustomer)=> {
        customerData = ({customerMessage:countCustomer.count});
        result.push(customerData);
    }).catch(err => {
        customerData = res.json({customerMessage:'Error'+err});    
    });
    await campaignModel.findAndCountAll({}).then((countCampaign)=> {
        campaignData = {campaignCount:countCampaign.count};
        result.push(campaignData);
    }).catch(err => {
        customerData = res.json({status:'False',Message:'Error'+err});    
    });
    // res.send(result);
    // res.json({status:'True',Message:result});
    // var ok = JSON.stringify(result);
    
    res.json(result);
};
