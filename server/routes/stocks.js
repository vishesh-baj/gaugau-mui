var express = require('express');
var router = express.Router();
const sequelize = require("../models/Users")
const Sequelizejkdf=require("../models/Jkdf");
const english=require("../langauge/en");
const hindi=require("../langauge/hn");
const marathi=require("../langauge/mr");
const punjabi=require("../langauge/pa");
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
const { json } = require('body-parser');

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

/*****************************GET STOCKS********************************************** */

router.post('/lang',function(req,res){
//console.log(langauge);
let langauge = req.headers['language'];
console.log("langauge",langauge);
if(langauge=='hi')
{
  res.send(hindi);

}else if(langauge=='mr')
{
  res.send(marathi);
}
else if(langauge=='pa')
{
  res.send(punjabi); 
}else
{



}



});


/*router.post('/homeApi',function(req,res)
{

    let customer_id = req.body.customer_id;  
    let langauge = req.body.langauge; 
    let data_array = []; 
    let page=1;
  
    sequelize.query("SELECT * FROM campaigan_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(rows => {
      if (rows.length > 0)
        {

          let campaign_id=   rows[0].campaign_id;
          sequelize.query("SELECT * FROM campaign WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [campaign_id]}).then(result => {
          if(result.length > 0)
         {

          let filter_query='SELECT stocks.*, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id where status=1';


         }
    });


        }  


      });

});*/



router.post("/getStocks", async function (req, res) {
  let headers = req.headers;
  let languagues = headers.languagues;
  let authorization = headers.authorization;
  let customer_id = req.body.customer_id;
  let offset = req.body.offset;
  /***Pagination Login Start ***/ 
  let limit = req.body.limit || 10;
  let pageNo = req.body.page_no * limit || 0;
  let limitQuery = ` LIMIT ${pageNo}, ${limit}`;
  /***Pagination Login END ***/
  // filter param
  var obj = {};
  let images = [];
  let animal_type = [];
  let filter_type = [];
  let breeds;
  let price = [];
  let breed_fiter = [];
  let dynamicquery = [];
  let lactation_number = [];
  let price_fiter = [];
  let lactation_numbers;
  let milk_capacity = [];
  let milk_capacitys;
  let pregnancy_delivery_status = [];
  let pregnancy_status_parm;
  let calf_status;
  let calf_status_arr = [];
  let no_of_teeth;
  let no_of_teeth_arr = [];
  let caif;
  //end
  let data_array = [];
  const rows = await sequelize.query(
    "SELECT * FROM campaign_customers WHERE customer_id = ?",
    {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      replacements: [customer_id],
    }
  );
  if (rows.length > 0) {
    let campaign_id = rows[0].campaign_id;
    const result = await sequelize.query(
      "SELECT * FROM campaigns WHERE id = ?",
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true,
        replacements: [campaign_id],
      }
    );
    if (result.length > 0) {
      let maxMin_filter = " ";
      let filter_query =
        "SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id";
      let group_by = "where inventory_status=1  GROUP by stocks.id";
      let criteria = result[0].criteria;
      var itemnew = JSON.parse(criteria);
      var cattle_type = "";
      let data_array1 = [];
      var breed = "";
      let data1 = [];
      let Data11 = [];
      let images = [];
      if (itemnew["Cattle_Type"]) {
        filter_query += " and animal_type = '" + itemnew["Cattle_Type"] + "' ";
        maxMin_filter += "animal_type = '" + itemnew["Cattle_Type"] + "' ";
      }
      if (itemnew["Breed"]) {
        filter_query += " and animal_breed = '" + itemnew["Breed"] + "' ";
        maxMin_filter += " and animal_breed = '" + itemnew["Breed"] + "' ";
      }
      /*             if(itemnew['Milk_Capacity'])
              { 
                filter_query += " and milk_capacity = '"+itemnew['Milk_Capacity']+"' ";
                maxMin_filter += " and milk_capacity = '"+itemnew['Milk_Capacity']+"' ";
              }
              if(itemnew['Lactation'])
              { 
                filter_query += " and lactation_number = '"+itemnew['Lactation']+"' ";
                maxMin_filter += " and lactation_number = '"+itemnew['Lactation']+"' ";
              }
              if(itemnew['Deliver_Status'])
              { 
                filter_query += " and pregnancy_delivery_time = '"+itemnew['Deliver_Status']+"' ";
                maxMin_filter += " and pregnancy_delivery_time = '"+itemnew['Deliver_Status']+"' ";
              }
 //this connection comming from jkdf */
              if(itemnew['base_price'])
              { 
                filter_query += " and base_price = '"+itemnew['base_price']+"' ";
                maxMin_filter += " and base_price = '" + itemnew["base_price"] + "' ";
              }
             
      let new_arr = [];
      / MaxMin Price start /
      const maxMinQuery =
        "SELECT MAX(base_price) ,MIN(base_price) FROM stocks WHERE ";
      const prepare_query_withOutLimit = maxMinQuery + maxMin_filter;
      const maxMin_Data = await Sequelizejkdf.query(
        prepare_query_withOutLimit,
        {
          type: sequelize.QueryTypes.SELECT,
          raw: true,
          replacements: [filter_query],
        }
      );
      / MaxMin Price end /
      let prepare_query = filter_query + group_by + limitQuery;
      const data = await Sequelizejkdf.query(prepare_query, {
        type: sequelize.QueryTypes.SELECT,
        raw: true,
        replacements: [filter_query],
      });
      let image_url = "";
      if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
          //code for filter
          if (
            data[i].animal_type == "cow" ||
            data[i].animal_type == "baffalo"
          ) {
            if (i == 0) {
              price = {
                min: maxMin_Data[0]["MIN(base_price)"],
                max: maxMin_Data[0]["MAX(base_price)"],
                selection: "single",
                image: "",
              };
              price_fiter.push(price);
            }
            if (i == 0) {
              obj = [
                {
                  parent_name: "Animal type",
                  id:1,
                  list_type: "grid",
                  childList: [
                    {
                      selection: "single",
                      title: "Cow",
                      image:
                        "https://staging.gaugau.co/img/stocks/235/angle2.jpeg",
                      id: "",
                    },
                    {
                      selection: "single",
                      title: "Baffalo",
                      image:
                        "https://staging.gaugau.co/img/stocks/241/angle2.jpeg",
                      id: "",
                    },
                  ],
                },
                (obj = {
                  parent_name: "Price",
                  id:2,
                  list_type: "grid",
                  childList: price_fiter,
                }),
                (obj = {
                  parent_name: "Breed",
                  id:3,
                  list_type: "grid",
                  childList: breed_fiter,
                }),
                (obj = {
                  parent_name: "pregnancy_status",
                  id:4,
                  list_type: "linear",
                  childList: pregnancy_delivery_status,
                }),
                (obj = {
                  parent_name: "lactation_number",
                  id:5,
                  list_type: "grid",
                  childList: lactation_number,
                }),
                (obj = {
                  parent_name: "Milk capcity",
                  id:6,
                  list_type: "grid",
                  childList: milk_capacity,
                }),
                (obj = {
                  parent_name: "Calf status",
                  id:7,
                  list_type: "grid",
                  childList: calf_status_arr,
                }),
                (obj = {
                  parent_name: "No of theeth",
                 id:8,
                  list_type: "grid",
                  childList: no_of_teeth_arr,
                }),
              ];
              filter_type.push(obj);
            }
            breeds = {
              title: data[i].animal_breed,
              id: data[i].id,
              animal_type: data[i].animal_type,
              selection: "single",
              image: "",
            };
            lactation_numbers = {
              title: data[i].lactation_number,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            milk_capacitys = {
              title: data[i].milk_capacity,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            pregnancy_status_parm = {
              title: data[i].pregnancy_delivery_status,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            calf_status = {
              title: data[i].calf,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            no_of_teeth = {
              title: data[i].animal_teeth_count,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            breed_fiter.push(breeds);
            lactation_number.push(lactation_numbers);
            milk_capacity.push(milk_capacitys);
            pregnancy_delivery_status.push(pregnancy_status_parm);
            calf_status_arr.push(calf_status);
            no_of_teeth_arr.push(no_of_teeth);
          }
          //end of filter
          //shortlist
          const shortstatus =await sequelize
            .query(
              "SELECT * FROM shortlisted_stocks WHERE stock_id = ? and  customer_id =?",
              {
                type: sequelize.QueryTypes.SELECT,
                raw: true,
                replacements: [data[i].id, customer_id],
              }
            )
              if (shortstatus.length > 0) {
                   data[i].shortlisted= true;
              } else {
                     data[i].shortlisted=false;
              }
/*          if (languagues == "hi") {
            if (data[i].animal_type == "Buffalo") {
              data[i].animal_type = hindi.Cattle;
            }
            if (data[i].animal_type == "buffalo") {
              data[i].animal_type = hindi.Cattle;
            }
            if (data[i].animal_type == "calf-cow") {
              data[i].animal_type = hindi.cow;
            }
            if (data[i].animal_breed == "Gir") {
              data[i].animal_breed = hindi.animal_breed;
            }
            if (data[i].animal_breed == "HF") {
              data[i].animal_breed = hindi.animal_breed;
            }
          }*/



           //transalate
       /*   const translations = await sequelize.query(
            "SELECT * FROM translations",
            {
              type: sequelize.QueryTypes.SELECT,
              raw: true,
              replacements: [],
            }
          );
         if(translations.length >0)
         {
              for(j=0;j<translations.length;j++)
              {
                   
                  if(translations[j].meta_key==data[i].animal_type)
                  {
                    console.log("languagues",languagues);
                    if (languagues == "hi") {
                         console.log("test",translations[j].hindi);
                         data[i].animal_type=translations[j].hindi;
                         data[i].animal_name=translations[j].hindi;
                    }
                    if (languagues == "en") {
                      console.log("test",translations[j].english);
                      data[i].animal_type=translations[j].english;
                      data[i].animal_name=translations[j].english;
                    }
                    if (languagues == "mr") {
                    console.log("test",translations[j].marathi);
                    data[i].animal_type=translations[j].marathi;
                    data[i].animal_name=translations[j].marathi;
                    }
                   if (languagues == "hi") {
                    console.log("test",translations[j].punjabi);
                    data[i].animal_type=translations[j].punjabi;
                    data[i].animal_name=translations[j].punjabi;

                     }
                  }


              }
     
         }*/







          let count;
          try{
            const resultData = await sequelize.query(
              "SELECT stock_id,count(stock_id) FROM shortlisted_stocks WHERE stock_id = ?",
              {
                type: sequelize.QueryTypes.SELECT,
                replacements: [data[i].id],
              }
            );
            count = resultData[0]["count(stock_id)"];
            if (count >= 2) {
              data[i].inDemand = 1;
            } else {
              data[i].inDemand = 0;
            }
          }catch(err){
            res.status(500).json(err);
          }
        }
        // filter array result
        var filter_arr = filter_type[0];
        res.json({
          status: true,
          message: "stocks lists",
          
         campaign_id:campaign_id,
         data,
          filter_arr,
        });
      } else {
        res.json({
          status: false,
          message: "Data does not found for this campigan",
        });
      }
    }
  } else {
    res.json({
      status: false,
      message: "No any one campigan assocaited with this customer",
    });
  }
});






router.post('/getStocks_old',async function(req,res)
{

    let headers=req.headers;
    //console.log("headers",headers.languagues);
    let languagues=headers.languagues;
    let authorization=headers.authorization;
    let customer_id = req.body.customer_id;
  //  let limit=req.body.limit;
 //   let page=req.body.page_no;
    let  offset=req.body.offset;
//
//Pagination Login Start
      let limit = req.body.limit || 10;
      let pageNo = req.body.page_no*limit || 0 ;
      let limitQuery = ` LIMIT ${pageNo}, ${limit}`;
      /***Pagination Login END ***/
   
//    let short_status;
    let shortlisted;
    //let langauge = req.body.langauge;
// filter param
              var obj = {};
              let images=[];
              let animal_type=[];
              let filter_type=[];
              let breeds;
              let price=[];
              let breed_fiter=[];
              let dynamicquery=[];
              let lactation_number=[];
              let price_fiter=[];
              let lactation_numbers;
              let milk_capacity=[];
              let milk_capacitys;
              let pregnancy_delivery_status=[];
              let pregnancy_status_parm;
              let calf_status;
              let calf_status_arr=[];
              let no_of_teeth;
              let no_of_teeth_arr=[];
let caif;
//end 
    console.log("languagues",languagues);
    let data_array = []; 
//    let page=1;
    sequelize.query("SELECT * FROM campaigan_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(rows => {
    if (rows.length > 0)
      {
        
     let campaign_id=   rows[0].campaign_id;
     sequelize.query("SELECT * FROM campaign WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [campaign_id]}).then(result => {
     if(result.length > 0)
     {

              let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
              let group_by='where inventory_status=1  GROUP by stocks.id';
              let criteria=result[0].criteria;
              var itemnew = JSON.parse(criteria);
              var cattle_type='';
              let data_array1=[];
              var breed='';
              let data1=[];
              let Data11=[];
//              const obj = {};
              let images=[];
              if(itemnew['Cattle_Type'])
              {
                 filter_query  += " and animal_type = '"+itemnew['Cattle_Type']+"' ";
              }
              if(itemnew['Breed'])
              { 
                filter_query += " and animal_breed = '"+itemnew['Breed']+"' ";
              }
 /*             if(itemnew['Milk_Capacity'])
              { 
                filter_query += " and milk_capacity = '"+itemnew['Milk_Capacity']+"' ";
              }
              if(itemnew['Lactation'])
              { 
                filter_query += " and lactation_number = '"+itemnew['Lactation']+"' ";
              }
              if(itemnew['Deliver_Status'])
              { 
                filter_query += " and pregnancy_delivery_time = '"+itemnew['Deliver_Status']+"' ";
              }

              if(itemnew['base_price'])
              { 
                filter_query += " and base_price = '"+itemnew['base_price']+"' ";
              }
              //this connection comming from jkdf */

              let new_arr=[];
              console.log("filter_query",filter_query);
             
              //let image=[];
             //  let image_url='https://staging.gaugau.co/img/stocks/';
             
              let prepare_query=filter_query+group_by+limitQuery;
              Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT,raw:true, replacements: [filter_query]}).then(data=>{
              let image_url='';

              console.log("Data",data);
              if(data.length > 0)
              {
                       
               
               for(i=0;i < data.length;i++)

                {

console.log("data",i);

                            //code for filter
if(data[i].animal_type=='cow' || data[i].animal_type=='baffalo'){

  if(i==0)
                  {
                    price={
                      "min":'5000',
                      "max":'5000',
                     // "id": Data[i].id ,
                    //  "animal_type":Data[i].animal_type ,
                       "selection": "single",
                       "image": ""
                    };

                    price_fiter.push(price);


                  }

if(i==0)
{
  obj= [
  {
    "parent_name": "Animal type",
     "id":1,
    "list_type": "grid",
 
    "childList": [
      {
        "selection": "single",
        "title": "Cow",
        "image": "https://staging.gaugau.co/img/stocks/235/angle2.jpeg",
        "id": ""
      },
      {
          "selection": "single",
        "title": "Baffalo",
        "image": "https://staging.gaugau.co/img/stocks/241/angle2.jpeg",
        "id": ""
      }
    ]
  },

  obj={
    "parent_name": "Price",
    "id":2,
    "list_type": "grid",
    "childList": 
    price_fiter
    
  },

obj={
    "parent_name": "Breed",
    "id":3,
    "list_type": "grid",
    "childList": 
     breed_fiter
    
  },

  obj={
    "parent_name": "pregnancy_status",
    "id":4,
    "list_type": "linear",
   // "animal_type":"",
      "childList":
     pregnancy_delivery_status
    
  },

  obj={
    "parent_name": "lactation_number",
    "id":5,
    "list_type": "grid",
    "childList":
     lactation_number
    
  },
  obj={
    "parent_name": "Milk capcity",
     "id":6,
    "list_type": "grid",
"childList":
    milk_capacity
    
  },
  obj={
    "parent_name": "Calf status",
    "id":7,
    "list_type": "grid",
     "childList": 
    calf_status_arr
    
  },
  obj={
    "parent_name": "No of theeth",
    "id":8,
    "list_type": "grid",
    "childList":
    no_of_teeth_arr
    
  },


  ]
 
  filter_type.push(obj)
  
} 

          breeds={
            "title":data[i].animal_breed,
            "id": data[i].id ,
            "animal_type":data[i].animal_type ,
             "selection": "single",
            "image": ""
          };
         
          lactation_numbers={
            "title":data[i].lactation_number,
            "id": data[i].id ,
            "animal_type":data[i].animal_type ,
            "animal_breed":data[i].animal_breed,
             "selection": "single",
            "image": ""
          };

            milk_capacitys={
            "title":data[i].milk_capacity,
            "id": data[i].id ,
            "animal_type":data[i].animal_type ,
            "animal_breed":data[i].animal_breed,
             "selection": "single",
            "image": ""
          };

          pregnancy_status_parm={
            "title":data[i].pregnancy_delivery_status,
            "id": data[i].id ,
            "animal_type":data[i].animal_type ,
            "animal_breed":data[i].animal_breed,
             "selection": "single",
            "image": ""
          };


          calf_status={
            "title":data[i].calf,
            "id": data[i].id ,
            "animal_type":data[i].animal_type ,
            "animal_breed":data[i].animal_breed,
             "selection": "single",
            "image": ""
          };


            no_of_teeth={
            "title":data[i].animal_teeth_count,
            "id": data[i].id ,
            "animal_type":data[i].animal_type ,
            "animal_breed":data[i].animal_breed,
             "selection": "single",
            "image": ""
          }; 

          breed_fiter.push(breeds);
          lactation_number.push(lactation_numbers);
          milk_capacity.push(milk_capacitys);
          pregnancy_delivery_status.push(pregnancy_status_parm);
          calf_status_arr.push(calf_status);
          no_of_teeth_arr.push(no_of_teeth); 
}
//end of filter

                    //shortlist
                    console.log("id",data[i].id);
                     sequelize.query("SELECT * FROM shortlisted_stocks WHERE stock_id = ? and  customer_id =?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [data[i].id,customer_id]}).then(shortstatus => {
//console.log("shortstatus",shortstatus);

    if(shortstatus.length > 0)
    {
//      short_status=true;
  //    data[i].shortlisted=true;
      
    }else
    {
     // short_status=false;
//      data[i].shortlisted=false;

    }

    });
                 // data[i].image_url = "https://staging.gaugau.co/img/stocks/";
//console.log("shortlist",short_status);

                  var shortlisted=false;
                data[i].shortlisted=shortlisted;

                  if(languagues=='hi')
                  {

                   if(data[i].animal_type=='Buffalo')
                   {

                    data[i].animal_type=hindi.Cattle;
                    console.log("hindi.Cattle",hindi.Cattle);
                  }
                  if(data[i].animal_type=='buffalo')
                  {

                    data[i].animal_type=hindi.Cattle;
                   
                 }
                 if(data[i].animal_type=='calf-cow')
                  {

                   data[i].animal_type=hindi.cow;
                 //  console.log("hindi.Cattle",hindi.calf-cow);
                 }
                 
                 if(data[i].animal_breed=='Gir')
                 {

                  data[i].animal_breed=hindi.animal_breed;
                //  console.log("hindi.Cattle",hindi.calf-cow);
                }
                if(data[i].animal_breed=='HF')
                 {

                  data[i].animal_breed=hindi.animal_breed;
                //  console.log("hindi.Cattle",hindi.calf-cow);
                }

               

                 



                  }
                     
                 
                     

                }
// filter array result
var filter_arr=filter_type[0];
                  res.json({
                  status: true,
                  message:'stocks lists',
                  data,       
                 filter_arr         
                   });
             
              

            
  
              }else{
                res.json({
                  status: false,
                  message:'Data does not found for this campigan',                
                   });      
              }
      });
    }
   });
  }else
      {
  
          res.json({
              status: false,
              message: 'No any one campigan assocaited with this customer',                
            });
  
  
      }
  });
    
});







router.post('/shortListold', async function(req, res){
  let customer_id = req.body.customer_id;  
  let  new_data=[];
  image_url='';
let campaign_id;
let client_id;

  const campiagan = await sequelize.query("SELECT * FROM campaigan_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(campiagan => {
  if (campiagan.length > 0)
      {
        
      campaign_id=   campiagan[0].campaign_id;
      client_id=   campiagan[0].client_id;
      }
    });


  const records = await sequelize.query('SELECT * FROM shortlisted_stocks WHERE customer_id = ? and qc_status= ?',{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id,0]});
  console.log("records",records);
  //res.send(records);
  let data=[];
  if(records.length > 0)
  {
    //let mergeresult=[];
    for(i=0; i < records.length; i++)
    {


      stock_id=records[i].stock_id; 
      let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
      let group_by=' where stocks.id='+stock_id+'  GROUP by stocks.id';
      let prepare_query=filter_query+group_by;
      console.log("prepare_query",prepare_query);
      //res.send(prepare_query);
      const mergeresult = await  Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: []})
      if(mergeresult.length > 0){
      data.push(mergeresult[0]);
      data.push(mergeresult[0].image_url='https://staging.gaugau.co/img/stocks/');
      res.json({
      status: true,
      message: 'Short list',
      campaign_id: campaign_id,
      client_id: client_id,                
      data
          
      });

      
    }else
    {

        res.json({
        status: false,
        message: 'Data does not found',             
        data
          
      });


    }

        // console.log(mergeresult)
        // res.send(data);

       
            
             
  }
}
    res.json({
    status: false,
    message: 'Data does not found',             
    data
      
  });


  });
















router.post('/shortListold',function(req,res){
  let customer_id = req.body.customer_id;  
  let  data_arry=[];
  image_url='';

  sequelize.query("SELECT * FROM shortlisted_stocks WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(rows => {
    if (rows.length > 0)
    {
      console.log("rows",rows.length);
          
       
      if(rows.length > 0)
      {
       
        for(i=0; i < rows.length; i++)
        {
         

          i++;
          stock_id=rows[i].stock_id; 
          let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
          let group_by=' where stocks.id='+stock_id+'  GROUP by stocks.id';
          let prepare_query=filter_query+group_by;
          console.log("prepare_query",stock_id);
          Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: []}).then(data => {
    
         // data[i].image_url = "https://staging.gaugau.co/img/stocks/";
            console.log("sdsadsad",i);
            res.json({
            status: true,
            message: 'Short list',             
            data,
              
          });
          });

         
         /*   res.json({
            success: true,
            message: 'Data list',             
            data_arry,
              
          });*/
         
        } 
         



        

      }

  
    }else
    {
        res.json({
        status: false,
        message: 'No data found',                
      });
    }

  });


});




/******************************************************STOCKS DETAILS*********************************************************** */



router.post('/getStocksdetails',async function (req, res) {
  let headers=req.headers;
  let languagues=headers.languagues;
  let authorization=headers.authorization;
  let customer_id = req.body.customer_id;  
  let stock_id = req.body.stock_id;  
  let langauge = req.body.langauge; 
  let data_array = []; 
  let page=1;
  let image_url='';
  let result='';
  let campaign_id;
  let client_id;
  let sorting_arry=[];
  let image_sort=[];


  //campigan

  let rows=await sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]});
  if(rows.length > 0)
  {
    
     campaign_id=rows[0].campaign_id;
     client_id=rows[0].client_id;

  }

  // stock check
  let short_status='';
  let shortstatus=await sequelize.query("SELECT * FROM shortlisted_stocks WHERE stock_id = ? and  customer_id =?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id,customer_id]})
  if(shortstatus.length > 0)
  {
    short_status=true;
    
  }else
  {
    short_status=false;

  }

  let filter_query='SELECT * from stocks where inventory_status=1 and id='+stock_id;
  console.log("filter_query",filter_query);
  let data= await Sequelizejkdf.query(filter_query,{type:sequelize.QueryTypes.SELECT,raw:true, replacements: [filter_query]})
//  console.log("datssa",data.length);
  if(data.length > 0)
  {

    var lang_param_data;
    let lang_type;
  //transalate 
/*const translations = await sequelize.query(
"SELECT * FROM translations",
{
  type: sequelize.QueryTypes.SELECT,
  raw: true,
  replacements: [],
}
);

if(translations.length >0)
{
  for(j=0;j<translations.length;j++)
  {
     if(languagues=='hi')
     {
      lang_type='hi';
      lang_param_data="hindi"
     }if(languagues=='en')
     {
      lang_type='en';
      lang_param_data=english
     }if(languagues=='mr')
     {
      lang_type='mr';
      lang_param_data=marathi
     }if(languagues=='pn')
     {
      lang_type='pn';
      lang_param_data=punjabi
     }



        if (languagues == lang_type) {
          
          if(translations[j].meta_key==data[0].animal_type)
          {

            console.log("fdf",lang_param_data);
            data[0]["animal_type"]=translations[j].hindi;   
            console.log("amit",translations[j].hindi);

          }
          if(translations[j].meta_key==data[0].animal_breed)
          {
            data[0]["animal_breed"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].pregnancy_delivery_status)
          {
            data[0]["pregnancy_delivery_status"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].milk_capacity)
          {
            data[0]["milk_capacity"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].lactation_number)
          {
            data[0]["lactation_number"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].last_delivery_date)
          {
            data[0]["last_delivery_date"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].calf)
          {
            data[0]["calf"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].estimated_delivery_date)
          {
            data[0]["estimated_delivery_date"]=translations[j].lang_param.tostring();    

          }
          if(translations[j].meta_key==data[0].animal_teeth_count)
          {
            data[0]["animal_teeth_count"]=translations[j].lang_param.tostring();    
          }
          if(translations[j].meta_key==data[0].last_lcatation_milking)
          {
            data[0]["last_lcatation_milking"]=translations[j].lang_param.tostring();    
          }
             
        }
      

  }

}*/

   var shortlisted;
    Sequelizejkdf.query("SELECT * FROM stock_images WHERE stock_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id]}).then(result => 
    {

  for(i=0; i < result.length; i++){
  console.log("result.length",result.length);
  result[i].image_url = "https://staging.gaugau.co/img/stocks/";
 // console.log("result",result);

   if(result[i].file_type=='video')
   {
    sorting_arry.push(result[i]);

   }
    if(result[i].file_type!='video')
   {

    // console.log("let sorting_arry",sorting_arry)
     image_sort.push(result[i]);

   }
  }
   
   data[0]["shortlisted"]=short_status;
   data[0]["share_url"]='http://staging.gaugau.co/animals/detail/';
  const merge = sorting_arry.concat(image_sort);      
  data[0]["image"] = merge; 				
  ///console.log(data);
  res.json({
  status: true,
  message:'stock details list',
  campaign_id:campaign_id,
  client_id:client_id,
  data,                
   });


  });

  }else{
    res.json({
      status: false,
      message: 'No data found',                
    });    
  }

});












router.post('/getStocksdetails_old',function(req,res)
{
 
    let headers=req.headers;
    let languagues=headers.langaugue;
    let authorization=headers.authorization;
    let customer_id = req.body.customer_id;  
    let stock_id = req.body.stock_id;  
    let langauge = req.body.langauge; 
    let data_array = []; 
    let page=1;
      
        let short_status='';
    sequelize.query("SELECT * FROM shortlisted_stocks WHERE stock_id = ? and  customer_id =?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id,customer_id]}).then(shortstatus => {
    if(shortstatus.length > 0)
    {
      short_status=true;
      
    }else
    {
      short_status=false;

    }

    });



    sequelize.query("SELECT * FROM campaigan_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(rows => {
    if (rows.length > 0)
      {
        
     let campaign_id=   rows[0].campaign_id;
    let client_id=rows[0].client_id;
     sequelize.query("SELECT * FROM campaign WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [campaign_id]}).then(result => {
     if(result.length > 0)
     {

              let filter_query='SELECT * from stocks where inventory_status=1 and id='+stock_id;
              let criteria=result[0].criteria;
              var itemnew = JSON.parse(criteria);
              var cattle_type='';
              let data_array1=[];
              var breed='';
              let data1=[];
              let Data11=[];
              const obj = {};
              let images=[];
              if(itemnew['Cattle_Type'])
              {
                 filter_query  += " and  animal_type = '"+itemnew['Cattle_Type']+"' ";
              }
              if(itemnew['Breed'])
              { 
                filter_query += " and animal_breed = '"+itemnew['Breed']+"' ";
              }
         /*     if(itemnew['Milk_Capacity'])
              { 
                filter_query += " and milk_capacity = '"+itemnew['Milk_Capacity']+"' ";
              }
              if(itemnew['Lactation'])
              { 
                filter_query += " and lactation_number = '"+itemnew['Lactation']+"' ";
              }
              if(itemnew['Deliver_Status'])
              { 
                filter_query += " and pregnancy_delivery_time = '"+itemnew['Deliver_Status']+"' ";
              }

              if(itemnew['base_price'])
              { 
                filter_query += " and base_price = '"+itemnew['base_price']+"' ";
              }
*/
//this connection comming from jkdf

console.log("queryong",filter_query);

              let new_arr=[];
             
              //let image=[];
             // let image_url='https://staging.gaugau.co/img/stocks/';
             
              Sequelizejkdf.query(filter_query,{type:sequelize.QueryTypes.SELECT,raw:true, replacements: [filter_query]}).then(data=>{
              let image_url='';
              let result='';
//                  data['shortlisted']=false;
              console.log("Data",data);
              if(data.length > 0)
              {
               var shortlisted;
                Sequelizejkdf.query("SELECT * FROM stock_images WHERE stock_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id]}).then(result => 
                {
                //  var i=0; i<Data.length;i++
              // Data.image=result
              for(i=0; i < result.length; i++){
              console.log("result.length",result.length);
              result[i].image_url = "https://staging.gaugau.co/img/stocks/";
              console.log("result",result);
  //             data[i].shortlisted=false;
//              data[i].share_url='staging.gaugau.co/animals/detail/';
          //    data[i]["shortlisted"]=false;
              }
               
               data[0]["shortlisted"]=short_status;
               data[0]["share_url"]='http://staging.gaugau.co/animals/detail/';
               data[0]["image"] = result; 
//               data['shortlisted']=false;
            
               console.log(data);
               res.json({
               status: true,
               message:'stock details list',
               campaign_id:campaign_id,
               client_id:client_id,
               data,                
               });

            
              });

              }else{
                res.json({
                  status: false,
                  message: 'No data found',                
                });    
              }
      });
    }
   });
  }else
      {
  
          res.json({
              status: false,
              message: 'No any one campigan assocaited with this customer',                
            });
  
  
      }
  });
    
});





/***********************************************ADD_STOCKS*******************************************************/



router.post('/shortlist_stocks',function(req,res){
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let campaign_id = req.body.campaign_id;
  let stock_status=req.body.stock_status;
  let messages='Shortlisted cattle sucessfully';
  let customer_deviceid='';
 let   cattle_no='';
 // sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
 // let customer_deviceid=data[0].fcm_device_id;
//});

sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
  customer_deviceid=data[0].fcm_device_id;
  cattle_no=data[0].number_of_cattle_to_buy;
   if(cattle_no==0)
   {

      res.json({
      status:false,
      message:'Shortlisted stocks limit exist',
      otp:otp
    });

   }
   else{
     final_val=cattle_no-1;
     sequelize.query("UPDATE customers SET number_of_cattle_to_buy=?  WHERE id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[final_val,customer_id]}).then(result => {});
   }
  
});


  console.log("customer_deviceid")


  if(stock_id == "")
  {
      res.json({
      status:false,
      message:'Stocks id field required',
      otp:otp
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message:'customer id field required',
      otp:otp
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message:'client id field required',
      otp:otp
    });

  }
 try{
    sequelize.query("SELECT * FROM shortlisted_stocks WHERE stock_id = ? and customer_id=? ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id,customer_id]}).then(rows => {
      if (rows.length > 0) {
        res.json({
          status:false,
          message:'This stock already shortlisted'
        });
      }else
      {
        sequelize.query("INSERT INTO shortlisted_stocks (stock_id,client_id,customer_id,campaign_id,createDate,status) VALUES (?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[stock_id,client_id,customer_id,campaign_id,currentDate,1]}).then(insertRow => {
        console.log(insertRow);
        let customer_deviceid=''; 
       
          if(insertRow)
          {

            

              res.json({
              status:true,
              message:'stocks added sucessfully'
            });

              var message = {
              to: customer_deviceid,
              collapse_key: 'green',

              notification: {
              title: 'Alert',
              body: 'Shortlisted catelog'
              },

            
          };

         /* fcm.send(message, function(err, response) {
            if (err) {
                   res.status(500).json({
                    success: false,
                    message: 'Something went wrong',
                    customerId: customer_deviceid,

                });
            } else {

                   res.status(200).json({
                    success: true,
                    message: 'Notification send successful!',
                    customerId: customer_deviceid,
                });
            }
        });*/
        sequelize.query("INSERT INTO notifications (customer_id,descriptions,status,createdDate) VALUES (?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[customer_id,messages,0,currentDate]}).then(insertRow => {});



          } else
          {
         
              res.json({
              status:false,
              message:'something went wrong'
            });

          } 
      });
    }
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



router.post('/add_orders',function(req,res){
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let messages='Order confirm cattle sucessfully';

  let qc_status=req.body.qc_status;
  if(stock_id == "")
  {
      res.json({
      status:false,
      message:'Stocks id field required',
      otp:otp
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message:'customer id field required',
      otp:otp
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message:'client id field required',
      otp:otp
    });

  }
 try{
      sequelize.query("SELECT * FROM confirm_shortlists WHERE stock_id = ? and customer_id=? ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id,customer_id]}).then(rows => {
      if (rows.length > 0) {
        res.json({
          status:false,
          message:'This Orders already added'
        });
      }else
      {
        sequelize.query("INSERT INTO confirm_shortlists (stock_id,client_id,customer_id,qc_status,createDate) VALUES (?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[stock_id,client_id,customer_id,qc_status,currentDate]}).then(insertRow => {
        console.log(insertRow);
          
          if(insertRow)
          {
              res.json({
              status:true,
              message:'Orders added sucessfully'
            });
           
            sequelize.query("INSERT INTO notifications (customer_id,descriptions,status,createdDate) VALUES (?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[customer_id,messages,0,currentDate]}).then(insertRow => {});
 

          } else
          {
         
              res.json({
              status:false,
              message:'something went wrong'
            });

          } 
      });
    }
  });
}
    catch(prem)
    {
      res.json({
        status:false,
        message: 'Something went wrong',                
      });

    }

})





router.post('/add_confirm_shortlist',function(req,res){
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let qc_status = 1;
  console.log("stock_id",stock_id);
  if(stock_id == "")
  {
      res.json({
      status:false,
      message:'Stocks id field required',
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message:'customer id field required',
      otp:otp
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message:'client id field required',
      otp:otp
    });

  }
 try{

  

  for(i=0;i < stock_id.length ; i++){

      sequelize.query("SELECT * FROM confirm_shortlists  WHERE stock_id=? and  customer_id=? ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id[i],customer_id]}).then(data => {
      if (data.length > 0) {
        res.json({
          status:false,
          message:'Stock  already shortlisted',
          data
        });
      }
});
//console.log("id",stock_id[i]);  
console.log("is",stock_id[i]);
    sequelize.query("INSERT INTO confirm_shortlists (stock_id,client_id,customer_id,qc_status,createDate,stock_status) VALUES (?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[stock_id[i],client_id,customer_id,qc_status,currentDate,0]}).then(insertRow => {
  

     if(insertRow.length > 0)
     {

        res.json({
        status:true,
        message:'Your stock confirm shortlisted for QC',
       
      });

     }else
     {
        res.json({
        status:false,
        message:'something went wrong',
       
      });


     }

});
sequelize.query("UPDATE shortlisted_stocks SET  qc_status =?  WHERE  stock_id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,stock_id[i]]}).then(result => {
if(result.length < 0)
{
    res.json({
    status:false,
    message:'something went wrong',
   
  });
}


})


 }
  
}
    catch(prem)
    {
      res.json({
status: true,
        message: 'Something went wrong',                
      });

    }

})


router.post('/deleteShortlist',function(req,res){
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;

  sequelize.query("delete from shortlisted_stocks WHERE stock_id = ? and customer_id=? ",{type:sequelize.QueryTypes.DELETE, raw:true,  replacements: [stock_id,customer_id]}).then(rows => {
    console.log("rows",rows);
    if(rows==undefined) {
        res.json({
        status:true,
        message:'Data deleted sucessfully'
      });
    }else
    {

        res.json({
        status:false,
        message:'something went wrong'
      });

    }



});
});


router.post('/bookings',function(req,res){
console.log("tesr");
});

router.post('/booking',function(req,res){
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let campaign_id=req.body.campaign_id;
  let status='booked';


  console.log("stock_id",stock_id);
  if(stock_id == "")
  {
      res.json({
      status:false,
      message:'Stocks id field required',
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message:'customer id field required',
     
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message:'client id field required',
     
    });

  }
 //try{

  Sequelizejkdf.query("SELECT * FROM bookings WHERE stock_id=?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id]}).then(data => {
    console.log("data.length",data.length);
    
    if (data.length > 0) {
        res.json({
          status:false,
          message:'This stock already ordered',
        
        });
      }else
      {
          Sequelizejkdf.query("INSERT INTO bookings (stock_id,client_id,customer_id,campaign_id,status) VALUES (?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[stock_id,client_id,customer_id,campaign_id,status]}).then(insertRow => {
          console.log("insertRow",insertRow.length);
            if(insertRow.length > 0)
              {
          
                  res.json({
                  status:true,
                  message:'Your booking sucessfully done your booking order no.',
                 
                });
          
               }else
               {
                  res.json({
                  status:false,
                  message:'something went wrong',
                 
                });
          
               }
          
          });


        
      }
});
  
})



router.post('/orders', async function(req, res){
  let customer_id_req = req.body.customer_id;  
  let  new_data=[];
  let data=[];
  let qc_status;
  let booking_status;
  let inventory_status;
  let booking_arry=[];
  let confirm_arr=[];
 // image_url='';
  let campaign_id;
  let client_id;
  let final_arry=[];
  let send_arry=[];

  const campiagan = await sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id_req]}).then(campiagan => {
  if (campiagan.length > 0)
      {
        
      campaign_id=   campiagan[0].campaign_id;
      client_id=   campiagan[0].client_id;
      }
    });

  const records = await sequelize.query('SELECT * FROM confirm_shortlists  WHERE customer_id = ?',{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id_req]});
  if(records.length > 0)
  {
  

    //data.push(mergeresult);  
  
    for(i=0; i < records.length; i++)
    {

     // let mergeresult=[];
     
      stock_id  =records[i].stock_id; 
      let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
      let group_by=' where stocks.id='+stock_id+'  GROUP by stocks.id';
      
    //  let filter_query_order='select s . *,m.image_path,m.is_primary,m.file_type,m.media_type,m.created ,b.status from stocks s inner join stock_images m on s.id = m.stock_id inner join bookings b on  b.stock_id = m.stock_id where s.id='+stock_id+' GROUP by s.id';
      let prepare_query=filter_query+group_by;
      console.log("prepare_query",prepare_query);
    
      const mergeresult = await  Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: []})
      console.log("mergeresult",mergeresult.length);
     
      if(mergeresult.length > 0){
      let booked;
      let booking_id;
      let   customer_id;
      const bookings = await  Sequelizejkdf.query('select status,id,customer_id  from bookings where stock_id=?' ,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: [stock_id]})
       if(bookings.length > 0)
       {
      
        customer_id=bookings[0].customer_id;  
        booked=bookings[0].status;
        booking_id=bookings[0].id;
       }
       else
       {
        booked='';
        booking_id='';
        customer_id=''; 
       }

      //  data[0].isActive = true;
     mergeresult[0].image_url='https://staging.gaugau.co/img/stocks/';
     mergeresult[0].booking_id=booking_id;
     mergeresult[0].booking_status=booked;
     mergeresult[0].customer_id=customer_id;
     data.push(mergeresult[0]);
   
     // data.push(mergeresult[0].images);
      
     
    
    // data.push(mergeresult[0].image_url=; 
   //  console.log("test_opl",data);
     
    }else
    {

     res.json({
     status: false,
     message: 'Data does not found in rows',             
       // data
          
      });

    }
        
  }

 //
//
//console.log("data",data);

//let counter = 0;



for(k=0;k<data.length;k++)
{

   qc_status=data[k]['qc_status'];
   booking_status=data[k]['booking_status'];
   inventory_status=data[k]['status'];


   if(qc_status==1 && booking_status=='booked')
   {
   send_arry.push(data[k]);
   }


   if(qc_status==1 && booking_status=='confirmed')
   {
    
   send_arry.push(data[k]);
   }


  if(qc_status==1) 
{
        send_arry.push(data[k]);

}


   ///console.log("qc_status",qc_status);
   //console.log("booking_status",booking_status);

   if(qc_status==2 && booking_status=='confirmed')
   {
    
     // console.log("confirmed",data[k]);
     // confirm_arr.push(data[k]);
   }


  

 

   if(qc_status==1 && booking_status=='')
   {
      
    //  final_arry.push(data[k]);
//      send_arry.push(data[k]);
   }



  }

//send_arry.push(booking_arry);
//send_arry.push(confirm_arr);
//send_arry.push(final_arry);


  //console.log("send_arry0",send_arry[0]);
  //console.log("booking_arry",booking_arry);

//data=final_arry;
data=send_arry;
 res.json({
  status: true,
  message: 'Order list',       
  campaign_id: campaign_id,
  client_id: client_id,      
  data
 });
 




}
    res.json({
    status: false,
    message: 'Data does not found in table',             
    data
      
  });


  });



router.post('/getNotification', async function(req, res){
  let customer_id = req.body.customer_id;  
  sequelize.query("SELECT * FROM notifications  WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
  if (data.length > 0)
  {


      res.json({
      status:true,
      message:'Notification list',
      data,
    });


  }else
  {


      res.json({
      status:false,
      message:'Data does not found',
    //  data,
    });

  }

  
  });


  });




router.get("/locations", async function (req, res) {
  const data = [];
  try {
    const state = await Sequelizejkdf.query("SELECT id,name FROM states ORDER BY id", {
      type:sequelize.QueryTypes.SELECT,
    });

    for (var i = 0; i < state.length; i++) {
      const stateData = [];
      stateData.push({
        id:state[i].id,
        name:state[i].name,
      });
      let districtData = [];
      const districtQuery = await Sequelizejkdf.query(
        'SELECT * FROM districts WHERE state_id = "' + state[i].id + '"',
        { type:sequelize.QueryTypes.SELECT}
      );
      for (var j = 0; j < districtQuery.length; j++) {
        const tehsilQuery = await Sequelizejkdf.query(
          'SELECT * FROM tehsils WHERE district_id = "' + districtQuery[j].id + '"',
          { type:sequelize.QueryTypes.SELECT }
        );
        let tehsil = [];
        for(var k = 0 ; k < tehsilQuery.length ; k++){
          tehsil.push({
            id:tehsilQuery[k].id,
            name:tehsilQuery[k].tahshil
        });
        }
        districtData.push({
            id:districtQuery[j].id,
            name:districtQuery[j].district,
            tehsil : tehsil
        });
        stateData.forEach(function(districts){
          districts.District = districtData;
        });
      }
        data.push(
          stateData[0]
        );
    }

  res.json({
                  status: true,
                  message:'All state,tehsil,district list',
             
                data,                
                   });
//    res.status(200).send(totalData);
  } catch (error) {
  //  console.log("fail");
    res.status(500).json(error);
  }
});



router.post('/shortList', async function(req, res){
  let customer_id = req.body.customer_id;
  let limit = req.body.limit || 10;
  let pageNo = req.body.page_no*limit || 0 ;
  let limitQuery = ` LIMIT ${pageNo}, ${limit}`;
  
  let  new_data=[];
  let data=[];
 // image_url='';
  let campaign_id;
  let client_id;

  const campiagan = await sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(campiagan => {
  if (campiagan.length > 0)
      {
        
      campaign_id=   campiagan[0].campaign_id;
      client_id=   campiagan[0].client_id;
      }
    });

  const records = await sequelize.query('SELECT * FROM shortlisted_stocks WHERE customer_id = ? and qc_status= ?',{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id,0]});
  if(records.length > 0)
  {
  

    //data.push(mergeresult);  
  
    for(i=0; i < records.length; i++)
    {

     // let mergeresult=[];
     
      stock_id  =records[i].stock_id; 
      let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
      let group_by=' where stocks.id='+stock_id+'  GROUP by stocks.id';
      let prepare_query=filter_query+group_by+limitQuery;
      console.log("prepare_query",prepare_query);
    
      const mergeresult = await  Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: []})
      console.log("mergeresult",mergeresult.length);
     
      if(mergeresult.length > 0){
      //  data[0].isActive = true;
  mergeresult[0].image_url='https://staging.gaugau.co/img/stocks/';
     data.push(mergeresult[0]);
   
     // data.push(mergeresult[0].images);
      
     
    
    // data.push(mergeresult[0].image_url=; 
     console.log("test_opl",data);
     
    }else
    {

     res.json({
     status: false,
     message: 'Data does not found',             
       // data
          
      });


    }

     
             
  }

 



 //

 res.json({
  status: true,
  message: 'Short list',       
  campaign_id: campaign_id,
  client_id: client_id,      
  data
        
    });
 




}
    res.json({
    status: false,
    message: 'Data does not found',             
    data
      
  });


  });






router.post('/update_notification',function(req,res){
let customer_id=req.body.customer_id;
let id=req.body.id;
let read_status=1;
let result;
if(customer_id=="")
{
    res.json({
    status:true,
    message:'Customer id required',
 
  });
}

if(customer_id!="" && id!="")
{

  sequelize.query("UPDATE notifications SET read_status=?  WHERE id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,id]}).then(result => {
    if(result)
    {
    
        res.json({
        status:true,
        message:'Notification sucessfully updated',
     
      });
    }else
    {
      res.json({
        status:false,
        message:'Something went wrong',
       
      });
    }

  });
}else
{
  sequelize.query("UPDATE notifications SET read_status=?  WHERE customer_id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,customer_id]}).then(result => {
    if(result)
    {
    
        res.json({
        status:true,
        message:'Notification sucessfully updated',
     
      });
    }else
    {
        res.json({
        status:false,
        message:'Something went wrong',
       
      });
    }

  });

}
})


router.post('/version_check',function(req,res){
let version=req.body.version;
let devicetype=req.body.device_type;
sequelize.query("SELECT * FROM app_versions WHERE device_type =? ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [devicetype]}).then(rows => {
  if (rows.length > 0) {
    var data=rows;
     if(rows[0].app_version > version)
     {
        res.json({
        status:true,
        message:'Move to force update',
        data
       });

     }else
     {

        res.json({
        status:false,
        message:'No need to force update',
        data
       });

     }
  
  }else
  {
      res.json({
      status:false,
      message:'Something went wrong',
     
    });
  }
});

});




router.post('/SendNotification', async function(req, res)
{
  let device_id=req.body.device_id;
  let notification_type;
  let descriptions;

   //const notification = await sequelize.query("SELECT * FROM shortlisted_stocks WHERE createDate =? ", { type: QueryTypes.SELECT , replacements: [currentDate]});
  
   //Shortlisted Cattle, not sent for Quality Check ( If 0 Cattles sent for QC ) → Shortlisting Screen
   let filter_query='SELECT shortlisted_stocks.*,customers.fcm_device_id, customers.id FROM shortlisted_stocks INNER JOIN customers ON customers.id = shortlisted_stocks.customer_id';
   let group_by=' where qc_status=1 and shortlisted_stocks.createDate > '+currentDate +'  group by shortlisted_stocks.customer_id'  ;
   let prepare_query=filter_query+group_by;


     //  Increase in Shortlisting qty updated because of failed QC status → → Shortlisting Screen
    let filter_query_5='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
    let group_by_5=' where stocks.qc_status=3 and stocks.inventory_status=1';
    let prepare_query_5=filter_query_5+group_by_5;

    //QC passed but was not booked → Order Screen
   let filter_query_2='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
   let group_by_2=' where stocks.qc_status=2 and bookings.status=""';
   let prepare_query_2=filter_query_2+group_by_2;

    //Booked but went out of stock → Order Screen
    let filter_query_3='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
    let group_by_3=' where stocks.qc_status=2 and stocks.inventory_status=2';
    let prepare_query_3=filter_query_3+group_by_3;

  
    //Booked but went out of stock → Order Screen
  let filter_query_1='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
  let group_by_1=' where stocks.qc_status=2 and bookings.status="Booked"  and stocks.inventory_status=2';
  let prepare_query_1=filter_query_1+group_by_1;

  

  
    //QC passed but went out of stock → Order Screen


    let filter_query_4='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
    let group_by_4=' where stocks.qc_status=2 and stocks.inventory_status=2  and bookings.status="Booked" group by stocks.id'  ;
    let prepare_query_4=filter_query_4+group_by_4;





//**********************************************************************************/
   console.log("prepare_query",prepare_query);
   const data = await sequelize.query(prepare_query,{type:sequelize.QueryTypes.SELECT,raw:true});
   let customer_device_id;
   let stocks_id;

   if(data.length > 0 )
   {
       console.log("datasss",data);
      notification_type=1;
      descriptions='Your stock shortlisted sucessfully , Please choose next step for furthers..';
      for(i=0;i<data.length;i++)
      {
       customer_device_id= data[i].fcm_device_id;
       stocks_id= data[i].stock_id;
  
      }

  }
//**********************************************************************************/
console.log("prepare_query",prepare_query_1);
const data2 = await Sequelizejkdf.query(prepare_query_1,{type:sequelize.QueryTypes.SELECT,raw:true});


if(data2.length > 0 )
{
   console.log("datasss",data);
   notification_type=2;
   descriptions='Your confirm booked shortlisted gone to out of stocks choose one new stocks';
   for(i=0;i<data2.length;i++)
   {
    customer_device_id= data2[i].fcm_device_id;
    stocks_id= data[i].stock_id;

   }

}

console.log("prepare_query",prepare_query_2);
const data3 = await Sequelizejkdf.query(prepare_query_2,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data3.length > 0 )
{
    console.log("datasss",data3);
    notification_type=3;
    descriptions='Your confirm booked shortlisted gone to out of stocks choose one new stocks';
   for(i=0;i<data3.length;i++)
   {
    customer_device_id= data3[i].fcm_device_id;
    stocks_id= data3[i].stock_id;

   }

}

console.log("prepare_query",prepare_query_2);
const data4 = await Sequelizejkdf.query(prepare_query_3,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data4.length > 0 )
{
    console.log("datasss",data4);
    notification_type=4;
    descriptions='Your stock shortlisted gone to out of stocks choose one new stocks';
   for(i=0;i<data4.length;i++)
   {
    customer_device_id= data4[i].fcm_device_id;
    stocks_id= data4[i].stock_id;

   }

}



console.log("prepare_query",prepare_query_2);
const data5 = await Sequelizejkdf.query(prepare_query_4,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data5.length > 0 )
{
    console.log("datasss",data4);
    notification_type=5;
    descriptions='Your confirm booked shortlisted gone to out of stocks choose one new stocks';
   for(i=0;i<data5.length;i++)
   {
    customer_device_id= data5[i].fcm_device_id;
    stocks_id= data5[i].stock_id;

   }

}



//**********************************************************************************/
console.log("prepare_query",prepare_query_2);
const data6 = await Sequelizejkdf.query(prepare_query_5,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data6.length > 0 )
{
   
  console.log("datasss",data6);
   notification_type=2;
   for(i=0;i<data6.length;i++)
   {
    customer_device_id= data6[i].fcm_device_id;
    stocks_id= data6[i].stock_id;

   }

}

    // fcm 
    var message = {
    to: customer_device_id,
    collapse_key: 'green',

    data : {
   
      
        body: {  //you can send only notification or only data(or include both)
          'descriptions': descriptions,
           // title: 'Alert',
          'id':stocks_id,
          'notification_type': notification_type
      },

  },

 

  
};
fcm.send(message, function(err, response) {
  if (err) {
         res.status(500).json({
          success: false,
          description: 'Something went wrong',
          customer_device_id: customer_device_id,

      });
  } else {

         res.status(200).json({
          success: true,
          description: 'Notification send successful!',
          notification_type: 0,
          customer_device_id: customer_device_id,
      });
  }
});

   
});







router.post('/SendNotification_old', async function(req, res)
{
  let device_id=req.body.device_id;
  let notification_type;

   //const notification = await sequelize.query("SELECT * FROM shortlisted_stocks WHERE createDate =? ", { type: QueryTypes.SELECT , replacements: [currentDate]});
   let filter_query='SELECT shortlisted_stocks.*,customers.fcm_device_id, customers.id FROM shortlisted_stocks INNER JOIN customers ON customers.id = shortlisted_stocks.customer_id';
   let group_by=' where qc_status=1 and shortlisted_stocks.createDate > '+currentDate +'  group by shortlisted_stocks.customer_id'  ;
   let prepare_query=filter_query+group_by;
   console.log("prepare_query",prepare_query);
   const data = await sequelize.query(prepare_query,{type:sequelize.QueryTypes.SELECT,raw:true});

   //res.send(data[');
   let customer_device_id;
   if(data.length > 0 )
   {
    console.log("datasss",data);
      notification_type=1;
      for(i=0;i<data.length;i++)
      {
       customer_device_id= data[i].fcm_device_id;
  
      }
    // fcm 
    var message = {
    to: customer_device_id,
    collapse_key: 'green',

    notification: {
    title: 'Alert',
    body: {  //you can send only notification or only data(or include both)
      'description': 'Notification send successful!',
      'notification_type': 0
  },
}

  
};
fcm.send(message, function(err, response) {
  if (err) {
         res.status(500).json({
          success: false,
          description: 'Something went wrong',
          customer_device_id: customer_device_id,

      });
  } else {

         res.status(200).json({
          success: true,
          description: 'Notification send successful!',
          notification_type: notification_type,
      });
  }
});

   }
});



function get_notification(){
var device_id=req.body.device_id;
var messges=req.body.message;  
var message = {
  to: device_id,
  collapse_key: 'green',
  notification: {
  title: 'Welcome messages',
  body: messages
  },
};
fcm.send(message, function(err, response) {
  if (err) {
    res.status(500).json({
     success: false,
     description: 'Something went wrong',
    

 });
} else {

    res.status(200).json({
     success: true,
     description: 'Notification send successful!',
   
 });
}
});
}



router.post('/get_notification_test', async function(req, res)
{
var device_id=req.body.device_id;
var descr=req.body.message;  
var message = {
  to: device_id,
  collapse_key: 'green',
  notification: {
  title: 'Welcome',
  body: descr
  },
};
fcm.send(message, function(err, response) {
  if (err) {
    res.status(500).json({
     success: false,
     description: 'Something went wrong',
    

 });
} else {

    res.status(200).json({
     success: true,
     description: 'Notification send successful!',
   
 });
}
});
})





module.exports = router;
