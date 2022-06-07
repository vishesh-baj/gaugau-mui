const db = require("../config/adminModelConfig.js");
const sequelize = require('sequelize');
const Op = sequelize.Op;
const DateTimeFormat  = require('format-date-time');
const formatter = new DateTimeFormat('YYYY-MM-DD');
const Customer = db.customer;
const Client = db.client;
const Districts = db.districts;
const breeds = db.breeds;
const stocks = db.stocks;
const suppliers = db.suppliers;
const campaigns = db.campaigns;
const campaignCustomerModel = db.campaignCustomers;
const calf = db.calf;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const csv = require('csv-parser');
const fs = require('fs');
const results = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

exports.addCsv = (req, res) => {
    fs.createReadStream('upload/csv/'+req.file.filename)
    .pipe(csv({}))
    .on('data', (data) =>{
         results.push(data)
        })
    .on ('end', () => {
        // console.log(results);
        results.forEach((results) => {
            var Address = (results.Address!='')?(results.Address):('NA');
            // console.log(Address);
            // var LastName = (results.LastName!='')?(results.LastName):('NA');
            // var State = new PromiseAll (results.State!='')?(State.findOne({where:{name:results.State}})):('NA');
            // var District = (results.District!='')?(Districts.findOne({where:{district:results.District}})):('NA');
            // console.log('District = ',District);
            var flag = 0;
            var resData = {};
            Customer.findOne({where:{mobile_number:results.Mobile}}).then(flag=1 ).catch(flag=0);
                // if(flag == 1){
                //     data = {
                //             first_name:results.FirstName,
                //             last_name:results.LastName,
                //             mobile_number:results.Mobile,
                //             number_of_cattle_to_buy:results.Cattle,
                //             address:Address,
                //             state_id:'NA',
                //             district_id:'NA',
                //             //tehsil_id:'NA',
                //             user_type:'INSIDE',
                //             is_verified:'1',
                //             registration:'true'
                //         }
                //     Customer.update(data,{where:{mobile_number:results.Mobile}}).then( result => {
                //         resData = res.status(200).json({'Status':'True','Message':'Data Updated Successfully'});
                //     }).catch( err => {
                //         resData = res.status(401).json({'Status':'False','Error':err});
                //     });
                // }else{
                //     Customer.create({
                //         first_name:results.FirstName,
                //         last_name:results.LastName,
                //         mobile_number:results.Mobile,
                //         number_of_cattle_to_buy:results.Cattle,
                //         address:Address,
                //         address:Address,
                //         state_id:'NA',
                //         district_id:'NA',
                //         user_type:'INSIDE',
                //         is_verified:'1',
                //         registration:'true'
                //     }).then( result => {
                //         resData = res.status(200).json({'Status':'True','Message':'Data Inserted Successfully'});
                //     }).catch( err => {
                //         resData = res.status(401).json({'Status':'False','Error':err});
                //     });
                // }    
                // return resData;
                console.log('flag = ',flag);
        });
    });
};

exports.campaginData = async (req, res) => {
    const client = await Client.findAll({
        where:{
            status:{[Op.not]:'-1'}
        }
    });
    // const breed = await breeds.findAll({
    //     attributes:['name']
    // });
    const supplier = await suppliers.findAll({
        attributes:['name']
    });
    

    const stock = await stocks.findAll({
        attributes: [
            [sequelize.fn('min', sequelize.col('base_price')), 'min_price'],
            [sequelize.fn('max', sequelize.col('base_price')), 'max_price']],
        raw: true,
    });
    res.json({status:'True',Client:client, Stock:stock, Supplier:supplier});
};

exports.campaginDelete = async (req, res) => {
    var updateData = {status : '-1'};
    await campaigns.update(updateData,{where:{id:req.params.id}}).then( () => {
        return res.status(200).json({'Status':'True','Message':'Data Deleted Successfully.'});
    }).catch( err => {
        return res.status(401).json({'Status':'False','Error':err});
    });
};

exports.campaginList = async (req, res) => {
    const campagins_ids = campagins_names = clients_names = clients_ids = customers_ids = customers_names = [];
    const current_date = new Date();
    var finalDate = formatter.now(current_date);
    await campaigns.findAll({
        include:[{
            model:campaignCustomerModel, as: 'campaign_customersref',
            attributes:['client_id','customer_id'],
            include:[{
                model:Client, as: 'clientref',
                attributes:['client_name']
            }]
        }],
        where:{
            campaign_expaire: {
                [Op.gte]: finalDate
            },
            status: {
                [Op.ne]: '-1'
            }
        }
    }).then( finalData => {
        res.json({status:'True',Data:finalData});
    }).catch( err => {
        res.json({status:'False',Error:'Error'+err});
    });  
};

exports.campaginCustomerList = async (req, res) => {
    await campaignCustomerModel.findAll({
        include:[{
            model:Customer, as :'customerref',
            attributes: [
                [sequelize.fn('GROUP_CONCAT', sequelize.col('first_name')), 'first_name']
                ]
           }],
        group: ['campaign_id'],
        where:{campaign_id:req.params.id}
    }).then( (finalData) => {
        return res.status(200).json({'Status':'True','Message':'Data Found Successfully.',Data:finalData});
    }).catch( err => {
        return res.status(401).json({'Status':'False','Error':err});
    });
};

exports.filter = async (req, res) => {
    const client = await Client.findAll({
        attributes:['client_name'],
        where:{
            status:{[Op.ne]:'-1'}
        }
    });

    const campaign = await campaigns.findAll({
        attributes:['campaign_name'],
        where:{
            status:{[Op.ne]:'-1'}
        }
    });

    res.json({status:'True',Client:client, Campaign:campaign});
};

exports.filterData = async (req, res) => {
    var dataValue = req.body;
    var end_date = formatter.now(dataValue.end_date);
    // var client_id, campaign_id = '';
    // (dataValue.client_id)?client_id = dataValue.client_id:client_id = '0';
    // (dataValue.campaign_id)?campaign_id = dataValue.campaign_id:campaign_id = '0';
    await campaignCustomerModel.findAll({
        attributes: [
            sequelize.fn('GROUP_CONCAT', sequelize.col('campaign_id')), 'campaign_id'
            ],
        include:[{
            model:campaigns, as: 'campaignsref',
            attributes:['campaign_name'],
            where:[{
                [Op.or]: [{campaign_expaire:{[Op.gte]: end_date}}]
            },{
                status:'1'  // campagin status
            }]
        },{
            model:Client, as: 'clientref',
            attributes:['client_name']
        }],
        where:{
            // [Op.or]: [[{ client_id:dataValue.client_id}, {campaign_id:dataValue.campaign_id }],{status:'1'}]
            
            [Op.or]:[{
                [Op.or]:[{ client_id:dataValue.client_id}, {campaign_id:dataValue.campaign_id }]
            }, {status:'1'}]
        },
    }).then( fianlData => {
        res.json({Data:fianlData});
    }).catch( err => {
        res.json({status:'False', Error:'Error'+err});    
    });
};

exports.campaginActiveStatus = async (req, res) => {
    var updateData = {status:req.body.status};
    await campaigns.update(updateData,{where:{id:req.params.id}}).then( finalData => {
        res.json({status:'True', Message:'Status Changed Successfully'});    
    }).catch( err => {
        res.json({status:'False', Error:'Error'+err});    
    });
};

exports.campaginInactiveStatus = async (req, res) => {
    var updateData = {status:req.body.status};
    await campaigns.update(updateData,{where:{id:req.params.id}}).then( finalData => {
        res.json({status:'True', Message:'Status Changed Successfully'});    
    }).catch( err => {
        res.json({status:'False', Error:'Error'+err});    
    });
};