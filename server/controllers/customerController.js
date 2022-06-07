const db = require("../config/adminModelConfig.js")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Customer = db.customer;
const clientModel = db.client;
const campaignModel = db.campaigns;
const campaignCustomer = db.campaignCustomers;
const districtModel = db.districts;
const stateModel = db.state;
const tahshilModel = db.tahshil;
var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


exports.addCustomer = async (req, res) => {
    let dataValue = req.body;
    for (const prop in dataValue) {
        if(_.isEmpty(dataValue[prop])){
            return res.json({
                status: "False",
                message: "Something is Missing In Object"
            })
        }
    }

    customer.create({
        client_name:dataValue.client_name,
        mobile_number:dataValue.mobile_number,
        descriptions:dataValue.descriptions,
        delete_status:'0'
    }).then( result => {
        return res.status(200).json({'Status':'True','Message':'Data Inserted Successfully','data':result});
    }).catch( err => {
        return res.status(401).json({'Status':'False','Error':err});
    });
};

exports.editCustomer = async (req, res) => {
    var data = await Customer.findOne({
        include:[{
            model:stateModel, as: 'stateref',
            attributes:['name']
        },{
            model:districtModel, as: 'districtref',
            attributes:['district']
        },{
            model:tahshilModel, as: 'tehsilref',
            attributes:['tahshil']
        },{
            model:campaignCustomer, as: 'campaign_customersref',
            attributes:['client_id','campaign_id'],
            include:[{
                model:clientModel, as: 'clientref',
                attributes:['client_name']
            },{
                model:campaignModel, as: 'campaignsref',
                attributes:['campaign_name']
            }]
        }],
        where:{id:req.params.id}
    });
    res.json({status:'True',Message:data});
};

exports.updateCustomer = async (req, res) => {
    var distId, stateId, tahshilId = '';
    var data = req.body;
    
    // for (const prop in data) {
    //     if(_.isEmpty(data[prop])){
    //         return res.json({
    //             status: "False",
    //             message: "Something is Missing In Field"
    //         })
    //     }
    // }

    await districtModel.findOne({where:{district:data.district}}).then( destVal => {
        distId = destVal.id;
        console.log('distId = ',distId);
    }).catch( err => {
        res.json({status:'False',Message:'District Not Found'});
    });

    await stateModel.findOne({where:{name:data.state}}).then( stateVal => {
        stateId = stateVal.id;
        console.log('stateId = ',stateId);
    }).catch( err => {
        res.json({status:'False',Message:'State Not Found'});
    });

    await tahshilModel.findOne({where:{tahshil:data.tehsil}}).then( tahshilVal => {
        tahshilId = tahshilVal.id;
        console.log('tahshilId = ',tahshilId);
    }).catch( err => {
        res.json({status:'False',Message:'State Not Found'});
    });

    var updateData = {
        first_name:data.name,
        mobile_number:data.mobile,
        number_of_cattle_to_buy:data.cattle,
        state_id:stateId,
        district_id:distId,
        tehsil_id:tahshilId
    };
    await Customer.update(updateData,{where:{id:req.params.id}}).then( result => {
        return res.status(200).json({status:'True',Message:'Data Updated Successfully.'});
    }).catch( err => {
        return res.status(401).json({status:'False',Error:err});
    });
};

exports.deleteCustomer = async (req, res) => {
    var data = {status:'-1'}
    await Customer.update(data, { where: {id:req.params.id}}).then( () => {
        return res.status(200).json({'Status':'True','Message':'Data Deleted Successfully.'});
    }).catch( err => {
        return res.status(401).json({'Status':'False','Error':err});
    });
    // return res.status(401).json({'Status':'False','Error':data});
};

exports.getCustomer = async (req, res) => {
    // var data = await Customer.findAll({where:{status:{[Op.not]:'-1'}}});
    
    var data = await Customer.findAll({
        include:[{
            model:stateModel, as: 'stateref',
            attributes:['name']
        },{
            model:districtModel, as: 'districtref',
            attributes:['district']
        },{
            model:tahshilModel, as: 'tehsilref',
            attributes:['tahshil']
        },{
            model:campaignCustomer, as: 'campaign_customersref',
            attributes:['client_id','campaign_id'],
            include:[{
                model:clientModel, as: 'clientref',
                attributes:['client_name']
            },{
                model:campaignModel, as: 'campaignsref',
                attributes:['campaign_name']
            }]
        }],
        where:{
            status:{[Op.not]:'-1'}
        }
    });
    res.json({status:'True',Message:data});
};
