var express = require('express');
var router = express.Router();
var moment=require('moment');
var monk=require('monk');
var multer=require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var db=monk('localhost:27017/bus');
var bus=db.get('bus');
var data=db.get('data');
var route=db.get('route');
var buslogin=db.get('buslogin');
var buscount = db.get('buscount');
/*Get Login Page*/
router.get('/', function(req, res, next) {
  res.render('pageloader');
});
/*Get Login page*/
router.get('/login',function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    res.redirect('/home');
  }
  else{
    req.session.reset();
    res.render('login');
  }
});
/*Post Login Details*/
router.post('/login',function(req,res){
  buslogin.findOne({"username":req.body.username,"password":req.body.password},function(err,user){
    if(!user){
      res.render('login', { error: 'Invalid username or password.' });
    }
    else{
        delete user.Password;
        req.session.user = user;
          res.redirect('/home');
      }
  });
});
/*Logout*/
router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/login');
});
/* GET home page. */
router.get('/home', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
  var date= moment().format('DD-MM-YYYY')
  console.log(date);
  var time= moment().format('h:mm:ss')
  console.log(time);
  data.find({"Date":date},function(err,docs){
  route.find({},function(err,docs1){
  bus.find({}, function(err,docs2){
  data.aggregate([
    { "$group": {
       "_id": "$BusNo",
       "count": {
           "$sum": {
               "$cond": [
                   { "$eq": [ "$Status", "IN" ] },
                   1,
                   { "$cond": [
                      { "$eq": [ "$Status", "OUT" ] },
                      -1,
                       0
                   ]}
               ]
           }
       }
    },
    },  
    {
      $out : "buscount"
    } 
    ]);
    buscount.find({"count":0}, function(err,docs5){
    buscount.find({"count":1}, function(err,docs6){
    res.locals.daywise=docs;
    res.locals.alldata=docs1;
    res.locals.addbus=docs2;
    res.locals.indata=docs6.length;
    res.locals.outdata=docs5.length;
    res.render('index');
  });
  });
  });
  });
  });
  } 
  else{
  req.session.reset();
  res.redirect('/login');
  }
});
// Bus data from external source
router.get('/bus/:Tagid',function(req,res){
  var date= moment().format('DD-MM-YYYY');
  var time= moment().format('h:mm:ss');
  var id = req.params.Tagid;
  bus.find({"Tagid":id}, function(err,data1){
  var busno = data1[0].BusNo;
  var status = data1[0].Status;
  data.insert({"BusNo":busno,"Tagid":id,"Status":status,"Date":date,"Time":time}, function(err,docs){
    res.redirect('/home');
  });
  });
});
//Add New Bus
router.post('/addbus', function(req,res){
  var newbus = {
    BusNo:req.body.busno,
    Tagid:req.body.tagid,
    Status:req.body.status
  }
  bus.insert(newbus, function(err,docs){
  res.redirect('/home');
  });
});
// edit added bus list
router.post('/edit', function(req,res){
  var id=req.body.no
  bus.find({"_id":id},function(err,docs){
  res.send(docs)
  });
});
//update added bus
router.post('/updatebus', function(req,res){
 var updatebus={
   BusNo:req.body.busno,
   Tagid:req.body.tagid,
   Status:req.body.status
 }
 bus.update({"_id":req.body.id},{$set:updatebus}, function(err,docs){
     if(docs){
       console.log(docs)
       res.redirect("/home");
     }
     else{
       console.log(err)
     }
 });
});
//rmove added bus
router.post('/remove', function(req,res){
 bus.remove({"_id":req.body.no}, function(err,docs){
   res.send(docs);
 });
});
//filter using date
router.post('/report' , function(req,res){
 var from=req.body.fromdate;
 //console.log(from);
 var to=req.body.todate;
 //console.log(to);
 data.find({"Date":{$gte:from,$lte:to}}, function(err,docs){
 //console.log(docs);
   if(docs){
     res.send(docs)
   }
   else{
     console.log(err)
   }
 });
});
// upload multiple bus data
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '../uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
});

var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
}).single('file');

    /** API path that will upload the files */
  router.post('/uploadxml', function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            if(!req.file){
              res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }            try {
                exceltojson({
                    input: req.file.path,
                    output: "out.json", 
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.send('error in importing data');
                    }
                    saveData(result);
               res.redirect("/home");

            });
            } catch (e){
                res.send("Corupted excel file");
            }
       });
});

function saveData(data) {
 //console.log(data);
for(var i=0;i<data.length;i++){
route.update({"BusNo":data[i].busno},{$set:{"BusNo":data[i].busno,"Town":data[i].town,"Route":data[i].route,"Code":data[i].code,"Model":data[i].model,"Capacity":data[i].capacity,"Strength":data[i].strength,"Standing":data[i].Standing,"Intime":data[i].intime,"Remarks":data[i].remarks}},{upsert: true},{multi:true},  function(err, data ) { 
    console.log(data);
    if(err)
    console.log(err);

});

}
}

module.exports = router;