
var express = require('express');
var router = express.Router();
const sequelize = require("../models/Users")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const multer = require('multer');
var SECRET_KEY = "85266";
var app = express();
const mailer = require('express-mailer'); // call express
//const { body, validationResult } = require('express-validator');
app.set('view engine', 'jade');
var moment = require('moment');
let currentDate = moment().format('YYYY-MM-DD'); 
let differnceTime = moment().format('YYYY-MM-DD h:mm:ss'); 
var bodyParser = require('body-parser')
var multiparty = require('multiparty');
const formidable = require('express-formidable');

var FCM = require('fcm-node');
let fcmkeys='AAAAEsCqLB4:APA91bFmKJIek2MtmE6yth2j0oiu64m5068pxxHEnrrNyIdknkRxPqUB57rxTGQE1GVJnFocw9E57ahQ--9C63SN0gODuDoumtXzo_Qm1aLt-Cwe6_TobSsf4HJcjjEBV4XqKD0Y1CZ1';
var fcm = new FCM(fcmkeys);




app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


/****************************jwt********************************************************* */
let token = jwt.sign({email:"gaugau@gmail.com",id:1},SECRET_KEY, {
  expiresIn: '24h'
})

/****************************checkToken********************************************************* */


const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (header !== 'undefined') {
    const token = header;
    req.token = token;
    next();
  } else {
    res.sendStatus(403)
  }
}

/*****************************LOGIN-VIA-MOBILE********************************************** */
router.post('/login',function(req,res)
{
  let headers=req.headers;
  let languagues=headers.langaugue;
  let authorization=headers.authorization;
  let mobile = req.body.mobile;
  let fcm_device_id= req.body.fcm_device_id;
  let otp=makeCode(4); 
  if(mobile.length > 0)
  {
    res.json({
      success:false,
      message:'Mobile field required',
      otp:otp
    });

  }
  //1 for verified, 0 for unverified
    sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
    if (rows.length == 0)
    {
     
    sequelize.query("INSERT INTO otp (customer_id,mobile_number,otp,is_verified,createdDate,status,otp_expaire_time) VALUES (?,?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[1,mobile,otp,0,currentDate,1,15245]}).then(result => {
    if (result.length > 0)
    {  
          res.json({
          status:true,
          message:'Otp sent to your register mobile number',
           otp:otp,
          id:result[0].id,
         
        });
        
      }else
      {
          res.json({
          status:false,
          message:'something went wrong',
          otp:otp
        });
//
      }
   });

    res.json({
    status:true,
    message:'Otp sent to your register mobile number',
    Action:'OTP PAGE',
    otp:otp,
     });
        } 
        else if(rows.length > 0)
        {
        
          if(rows[0].is_verified==0)
          {
            res.json({
            status:true,
            message:'Otp sent to your register   number' ,
            otp: otp,
            id:rows[0].id
            
          });
          sequelize.query("UPDATE otp SET is_verified= ?,otp=?, updatedDate=? WHERE id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,rows[0].id]}).then(result => {});

          }else
          {
          sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [rows[0].mobile_number]}).then(data => {
          if(data.length >0)
          {
            let customer_id=data[0].id;  
            sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(results => {
              if(results.length==0)
             {
            res.json({
           status:true,
           message:'otp sent your register number',
           otp:otp,

    });


console.log("testotp",otp);
sequelize.query("UPDATE otp SET is_verified= ?, otp=?,updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,mobile]}).then(result => {});
             //    res.json({
             //    status:false,
             //    message:'No any one campaign found for this customers'
              // });
             }
              else if(results.length > 0)
             { 
                res.json({
                 status:true,
                 message:'otp send your register number',
               //  token:token,
                 otp:otp,
               });
console.log("otp",otp);
    sequelize.query("UPDATE otp SET is_verified= ?, otp= ?, updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,mobile]}).then(result => {});     



             } 
     });

}else
{

      res.json({
      status:true,
      message:'otp sent your register number',
      otp:otp,

    });

sequelize.query("UPDATE otp SET is_verified= ?, otp=?,updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,mobile]}).then(result => {});
    }    
});
}
 }
})
})


router.post('/okll',function(req,res){
    var date1='2022-04-06 05:30:00';
  //res.send(req.body);
 // console.log("body",req.body);
  /*var date1='2022-04-06 05:30:00';
  var df=differnceTime.getTime  var Difference_In_Time=differnceTime-date1;*/
 /* var date1='2022-04-06 05:30:00';
  var test = date1.getTime(); 
  var test1 = new Date().getTime(differnceTime);
  var total = test1 - test;*/

  /*var startTime = new Date('2012/10/09 12:00'); 
var endTime = new Date('2013/10/09 12:00');
var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
var resultInMinutes = Math.round(difference / 60000);
  res.send({"total":resultInMinutes});  */
  var today = differnceTime;
var Christmas =date1;
var diffMs = (Christmas - today); // milliseconds between now & Christmas
var diffDays = Math.floor(diffMs / 86400000); // days
var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
//alert(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas =)");
res.send((diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas ="));

});

/************************************FILE UPLOADS**************************************************************** */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
/**************************************************************************************************** */


/**********************************************Registrater***********************************************/
router.post('/logout',function(req,res)
{
  let mobile = req.body.mobile;
  sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
   if (rows.length > 0)
    {

      sequelize.query("UPDATE otp SET is_verified= ?, updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,currentDate,mobile]}).then(result => {
      res.json({
      status: true,
      message: 'successful! logout',                
              });
          });

    }else
    {

      res.json({
        status: false,
        message: 'Fail!',                
      });

    }

  });
  
});

/*router.post('/registers',upload.single("image"),function(req,res){
  
  res.send("SUCESS");


});*/

  router.post('/registers',function(req,res){
  var form = new multiparty.Form();
  let headers=req.headers;
  let languagues=headers.langaugue;
  let authorization=headers.authorization;
  var uniq=makeCode(6);
  form.parse(req, function(err, body, files) {
  console.log("body",body.first_name);  
  console.log("files",files.image);
  let first_name = body.first_name; 
  let middle_name = body.middle_name; 
  let last_name = body.last_name; 
  let state_var = body.state_id; 
  let district =body.district_id; 
  let address = body.address;
  let teshil =body.tehsil_id;
  let images='';
console.log("test",files);
//  if(file!=""){
 // let images = files.image[0].originalFilename;
 // }else
  //{
   //let images ='';
  //}
  let mobile_number = body.mobile;
  

console.log("first_name.length",body.first_name);
  //let no_of_catal_need= req.body.no_of_catal_need;
  if(first_name == "")
  {
    res.json({
      status:false,
      message:'First name field required',
      
    });
  }
  if(last_name == "")
  {
    res.json({
      status:false,
      message:'last name field required',
      
    });

  }
  if(state_var == "")
  {
    res.json({
      status:false,
      message:'state field required',
      
    });

  }
  if(district == "")
  {
    res.json({
      status:false,
      message:'District field required',
     
    });
  }
  try {
  sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile_number]}).then(CustomerRes => {
  if(CustomerRes.length >0)
  {

      res.json({
      status:false,
      message:'Mobile Number already exist ,Please registration another numbers',
     
    });

  }
  });
  sequelize.query("INSERT INTO customers (first_name,middle_name,last_name,state_id,district_id,tehsil_id,is_verified,created,number_of_cattle_to_buy,address,image,mobile_number) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[body.first_name,middle_name,body.last_name,body.state_id,body.district_id,body.tehsil_id,1,currentDate,0,body.address,images,body.mobile]}).then(insertRow => {
   console.log(insertRow);
   
   if(insertRow)
   {
       sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [insertRow[0]]}).then(Data => {
       res.json({
       status:true,
       message:'Your registration process in sucessful',
       ACTION:'HOME PAGE',
       Data:Data,
      
     });
    });
   }else
   {

      res.json({
      status:false,
      message:'something went wrong! try again later',
     
    });

   }
})
 }
  catch (ex) {  
    res.json({
    status: false,
    message: 'Something went wrong.'      
    }); 
    
    }

  });// end loops 


});

/***********************************UPLOAD************************************************ */
router.post('/profile',
  upload.none(), function (req, res, next) {
    // validate `req.body.name` here
    // and call next(err) if it fails
  //  res.end('done!');
    next();
  },
  upload.single('image'), function (req, res, next) {
    // file is now uploaded, save the location to the database
    res.end('done!');
  });

/***********************************UPLOAD************************************************ */






/***************************************otp verify****************************************************************/

router.post('/verifyotp',function(req,res){
  let mobile = req.body.mobile;
  let otp = req.body.otp;    
  let headers=req.headers;
  let languagues=headers.langaugue;
  let authorization=headers.authorization;
  let device_type = req.body.device_type;  
  let device_id = req.body.device_id; 
  let langaugue = req.body.langaugue; 
  let fcm_token = req.body.fcm_token;

  let messagesng='Welcome to Gaugau ,Thankyou for registration';
  var  notification_type=0;
  id=0;
  send_notification(fcm_token,messagesng,id,notification_type);
 
  sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
  if (rows.length == 0) {
            res.json({
            status:false,
            message:'Invalid  Mobile number'
          });
        } else{   

          if(rows[0].is_verified==1)
          {
           // res.json({
            //  status:false,
             // message:'Otp already verified',
             
           // });
 sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(data => {

              res.json({
              status:false,
              message:'Otp already verified',
              data
             
            });
          });

          }   

          if(rows[0].otp == otp)
          {
            //  res.json({
             // status:true,
             // message:'Otp verify successfully',
             // Action:"REGISTRATION PAGE FOR OUTSIDE USERS",
             // rows,
 sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(data => {

            if(data.length > 0)
            {
              res.json({
                status:true,
                message:'Otp verify successfully',
                //Action:"REGISTRATION PAGE FOR OUTSIDE USERS",
                Authorization:token,
                 data,
  
               
              });

            }else
            {
                

              res.json({
                status:true,
                message:'Otp verify successfully',
                //Action:"REGISTRATION PAGE FOR OUTSIDE USERS",
                data:[ {
                 Registration:"false",
//                  Cattle: false
                }
              ]
                })
            }

             
          });
             
           
            sequelize.query("UPDATE otp SET is_verified= ?, updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,currentDate,mobile]}).then(rows => {
            res.json({
                    status: true,
                    message: 'successful!',                
                  });
              });
             sequelize.query("UPDATE customers SET fcm_device_id= ?, device_type=?,device_id=?,updated=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[fcm_token,device_type,device_id,currentDate,mobile]}).then(rows => { });
             sequelize.query("UPDATE otp SET fcm_token =? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[fcm_token,mobile]}).then(rows => { });        
          }
          else
          {
            res.json({
              status:false,
              message:'Otp does not  matched',
             
            });

            }
          }
      })
})


/******************************************RESEND OTP****************************************************** */
router.post('/resendotp',function(req,res){
  let mobile = req.body.mobile;
  let headers=req.headers;
  let languagues=headers.langaugue;
  let authorization=headers.authorization;
  let otp=makeCode(4); 
  if(mobile.length > 0)
  {
    res.json({
      status:false,
      message:'Mobile field required',
      otp:otp
    });

  }  
 try{
    sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
      if (rows.length == 0) {
        res.json({
          status:false,
          message:'Invalid  Mobile number'
        });
      }  
    });
   sequelize.query("UPDATE otp SET otp= ?, updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[otp,currentDate,mobile]}).then(rows => {
    res.json({
      status: true,
            message: 'Otp sent to your register mobile number ' +  otp,                
          });
      });
    }
    catch(prem)
    {
      res.json({
        success: true,
        message: 'Something went wrong',                
      });

    }

})

/**************************************ADD_CATYLE******************************************************* */
router.post('/add_cattle',function(req,res){
  let headers=req.headers;
  let languagues=headers.langaugue;
  let authorization=headers.authorization;
  let mobile = req.body.mobile;
  let id = req.body.id;
  let no_of_cattle = req.body.no_of_cattle;
  let otp=makeCode(4); 
  if(mobile.length > 0)
  {
      res.json({
      status:false,
      message:'Mobile field required',
      otp:otp
    });

  }  
 try{
    sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
      if (rows.length == 0) {
        res.json({
          status:false,
          message:'Invalid  Mobile number'
        });
      }  
    });
   sequelize.query("UPDATE customers SET number_of_cattle_to_buy= ?, updated=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[no_of_cattle,currentDate,mobile]}).then(rows => {
    res.json({
      status: true,
            message: 'Your mobile number pending for approval by admin',                
          });
      });
    }
    catch(prem)
    {
      res.json({
        success: true,
        message: 'Something went wrong',                
      });

    }

})




router.post('/getCustomer',function(req,res)
{
	
  let headers=req.headers;
  let languagues=headers.langaugue;
  let authorization=headers.authorization;
  let customer_id = req.body.customer_id;
  
    sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
  if (data.length > 0) {
            res.json({
            status:true,
            message:'customer list',
			data
          });
        } else{  
res.json({
            status:false,
            message:'something went wrong',
			data
          });		

		}
	});
	
	
});



/************************************************************************************************ */



/******************************************OTP CODE****************************************************** */
function makeCode(length) {
  var result           = '';
  var characters       = '5245';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



router.post('/endpoint', function (req, res) { 
  
  var form = new multiparty.Form();
  
  form.parse(req, function(err, fields, files) {
    console.log("err",err);
    var first_name=fields.first_name;
    console.log("fields",fields.first_name);
    console.log("files",files);
    if(fields.first_name=="")
    {
      res.json({
        status:false,
        message:'required fields',
       
      });

    }   
    //console.log("name",req.body.first_name);
      // fields fields fields
  });
})




router.post('/update_profile',function(req,res){
var form = new multiparty.Form();  
form.parse(req, function(err, body, files) {
  let customer_id = body.customer_id; 
  let first_name = body.first_name; 
  let middle_name = body.middle_name; 
  let last_name = body.last_name; 
  let state_var = body.state_id; 
  let district =body.district_id; 
  let address = body.address;
  let teshil =body.tehsil_id;
  let images='';

    sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
    if (data.length > 0)
     {



  if(body.customer_id=="")
  {

      res.json({
      status:false,
      message:'Customer id required field',
      
    });
}

//try
//{
  console.log("rererer");//,state_var=? ,district=?,address=?,teshil=?,image=? //state_var,district,address,teshil,image,
  sequelize.query("UPDATE customers SET first_name= ?, middle_name=?,last_name=? ,state_id=? ,district_id=?,address=?,tehsil_id=?,image=? WHERE id = ? ",
  {type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[first_name,middle_name,last_name,state_var,district,address,teshil,images,customer_id]}).then(rows => { });
  {
    res.json({
    status:true,
    message:'Sucessfully updated',
    data,
   
  });

} 
/*}catch(error)
{
    res.json({
    status:false,
    message:'Something went wrong',
   
  });

} */
}else
{
res.json({
status:false,
message:'Data does not found',
});
}
});
});
})






router.post('/update_profile',function(req,res){
var form = new multiparty.Form();  
form.parse(req, function(err, body, files) {
  let customer_id = body.customer_id; 
  let first_name = body.first_name; 
  let middle_name = body.middle_name; 
  let last_name = body.last_name; 
  let state_var = body.state_id; 
  let district =body.district_id; 
  let address = body.address;
  let teshil =body.tehsil_id;
  let images='';
  if(body.customer_id=="")
  {

      res.json({
      status:false,
      message:'Customer id required field',
      
    });
}

//try
//{
  console.log("rererer");//,state_var=? ,district=?,address=?,teshil=?,image=? //state_var,district,address,teshil,image,
  sequelize.query("UPDATE customers SET first_name= ?, middle_name=?,last_name=? ,state=? ,district=?,address=?,teshil=?,image=? WHERE id = ? ",
  {type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[first_name,middle_name,last_name,state_var,district,address,teshil,images,customer_id]}).then(rows => { });
  {
    res.json({
    status:true,
    message:'Sucessfully updated',
   
  });

} 
/*}catch(error)
{
    res.json({
    status:false,
    message:'Something went wrong',
   
  });

} */

});
})




router.post('/smsApi',async function(req,res){
var request = require("request");  
var options = { method: 'POST',
url: 'https://enterprise.smsgupshup.com/GatewayAPI/rest',
form: 
  { method: 'sendMessage',
  send_to: '918770942076',
  msg: 'Thanks for registering to Gaugau. Your confidential OTP is @__123__@',
  msg_type: 'TEXT',
  userid: '2000194577', 
  auth_scheme: 'PLAIN',
  password: 'Gaugau123*',
  format: 'JSON' } };
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
  //res.send(body);
  });

});



function send_notification(device_id,messagesng,id,notification_type){
  console.log("device_id",device_id);
  console.log("messagesng",messagesng);
  //device_id,messagesng,id,notification_type
  var message = {
  to: device_id,
  collapse_key: 'green',
  data : {
  body: {  
           'descriptions': messagesng,
            'id':id,
           'notification_type': notification_type
       },
   },
};
fcm.send(message, function(err, response) {
  if(err) {
    console.log(message);
         console.log("Something has gone wrong !");
   } else {
       console.log("Successfully sent with resposne :",response);
     }
  //console.log("err",err);
});
}






module.exports = router;
