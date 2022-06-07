const sequelize = require("../models/Users")
var express = require('express');
var router = express.Router();
const adminCtrl = require('../controllers/adminController');
const clientCtrl = require('../controllers/clientController');
const customerCtrl = require('../controllers/customerController');
const loginCtrl = require('../controllers/loginController');
const campaignCtrl = require('../controllers/campaignController');

const multer = require('multer');
var storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'upload/csv/')
    },
    filename:function(req, file, cb){
        var filName = Date.now()+file.originalname;
        cb(null,filName)
    }
});
var upload = multer({storage:storage});
// client Api
router.get('/nice',adminCtrl.nice);
router.post('/addClient',clientCtrl.addClient);
router.get('/editClient/:id',clientCtrl.editClient);
router.put('/updateClient/:id',clientCtrl.updateClient);
router.put('/deleteClient/:id',clientCtrl.deleteClient);
router.get('/clientList',clientCtrl.getClient);
router.get('/login',loginCtrl.adminData);
router.get('/dashboard',loginCtrl.dashboardCount);

router.post('/addCustomer',customerCtrl.addCustomer);
router.get('/customerList',customerCtrl.getCustomer);
router.get('/editCustomer/:id',customerCtrl.editCustomer);
router.put('/updateCustomer/:id',customerCtrl.updateCustomer);
router.put('/deleteCustomer/:id',customerCtrl.deleteCustomer);

router.get('/campaginList',campaignCtrl.campaginList);
router.get('/filter',campaignCtrl.filter);
router.post('/filterData',campaignCtrl.filterData);
router.put('/campaginDelete/:id',campaignCtrl.campaginDelete);
router.put('/campaginActive/:id',campaignCtrl.campaginActiveStatus);
router.put('/campaginInactive/:id',campaignCtrl.campaginInactiveStatus);
router.get('/campaginUserList/:id',campaignCtrl.campaginCustomerList);
router.post('/addCsv',upload.single('file'),campaignCtrl.addCsv);
router.get('/campagin',campaignCtrl.campaginData);

// Amit Verma Code 
// router.get('/getClient',function(req, res){
//    sequelize.query("SELECT * FROM clients",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: []}).then(data => {
//     if (data.length > 0)
//     {
//           res.json({status:'True',Message:data});
//     }
//   });
// });


module.exports = router;