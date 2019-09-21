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
var test = db.get('test');
var route=db.get('route');
var buslogin=db.get('buslogin');
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
  //console.log(date);
  var time= moment().format('h:mm:ss')
  //console.log(time);
  data.find({"Date":date},function(err,docs){
  test.find({"Date":date}, function(err,docs2){
  route.find({},function(err,docs10){
    for(i=0;i<=166;i++){
      var busno=docs10[i].BusNo;
      route.update({"BusNo":busno},{$set:{"Date":date}})
    }
 
  route.find({"Town":"Kakinada"}, function(err,docs3){
  route.find({"Town":"Rajahmundry"}, function(err,docs4){
  route.find({"Town":"Mandapeta"}, function(err,docs5){
  route.find({"Town":"Others"}, function(err,docs6){
  bus.find({}, function(err,docs7){
  bus.find({"Status":"IN","IN":1,"Date":date}, function(err,docs8){
  bus.find({"Status":"OUT","OUT":1},function(err,docs9){
    res.locals.daywise=docs;
    res.locals.route=docs2;
    res.locals.Kakinda=docs3;
    res.locals.Rajahmundry=docs4;
    res.locals.Mandapeta=docs5;
    res.locals.others=docs6;
    res.locals.addbus=docs7;
    res.locals.indata=docs8.length;
    res.locals.outdata=docs9.length;
    res.render('index');
  });
  });
  });
  });
  });
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
//update bus route data 
router.post('/routedata', function(req,res){
  var id=req.body.no; 
  var str=req.body.Strength;
  var stand=req.body.Stand;
  var intime=req.body.Intime;
  var remark=req.body.Remarks;
  var route=req.body.Route;

  test.update({"_id":id},{$set:{"Route":route,"Strength":str,"Standing":stand,"Intime":intime,"Remarks":remark}}, function(err,docs){
    if(docs){
      // console.log(docs)
      res.redirect('/home');
        test.findOne({"_id":id}, function(err,docs2){
              if(docs2){
                var busno=docs2.BusNo
                route.update({"BusNo":busno},{$set:{"Strength":str,"Standing":stand,"Intime":intime,"Remarks":remark}}, function(err,docs3){
                  // console.log(docs3)
                })
              }
              else{
                console.log(err)
              }
         })
    }
    else{
      console.log(err)
    }
  })

  
  
})
//insert kakinada route data
router.post('/insertdata', function(req,res){
  var date= moment().format('DD-MM-YYYY')
 var bus=req.body.busno;
  var town=req.body.town;
  var rout=req.body.route;
  var code=req.body.code;
  var capacity=req.body.capacity;
  var model=req.body.model;
  var strength=req.body.strength;
  var standing=req.body.standing;
  var intime=req.body.intime;
  var remarks=req.body.remarks;
  route.count({"Town":"Kakinada"},function(err,docs){
    var count=docs;
      
    for(i=0;i<=count-1;i++){
      var faith={
        BusNo:bus[i],
        Town:town[i],
        Route:rout[i],
        Code:code[i],
        Model:model[i],
        Capacity:capacity[i],
        Strength:strength[i],
        Standing:standing[i],
        Intime:intime[i],
        Remarks:remarks[i],
        Date:date
      }
      test.insert(faith,function(err,docs){
        if(docs){
        // console.log(docs)
        route.update({"BusNo":docs.BusNo},{$set:{"Strength":docs.Strength,"Standing":docs.Standing,"Intime":docs.Intime,"Remarks":docs.Remarks}}, function(err,docs1){
          // console.log(docs1)
        })
        }
        else{
          console.log(err)
        }
      })
    
    }
       res.redirect('/home')
    })
    
  })

//inserting Rajahmundry bus route data  
router.post('/insert-rajahmundry-data', function(req,res){
  var date= moment().format('DD-MM-YYYY')
 var bus=req.body.busno;
  var town=req.body.town;
  var rout=req.body.route;
  var code=req.body.code;
  var model=req.body.model;
  var capacity=req.body.capacity;
  var strength=req.body.strength;
  var standing=req.body.standing;
  var intime=req.body.intime;
  var remarks=req.body.remarks;
  route.count({"Town":"Rajahmundry"},function(err,docs){
    var count=docs;
      
    for(i=0;i<=count-1;i++){
      var faith={
        BusNo:bus[i],
        Town:town[i],
        Route:rout[i],
        Code:code[i],
        Model:model[i],
        Capacity:capacity[i],
        Strength:strength[i],
        Standing:standing[i],
        Intime:intime[i],
        Remarks:remarks[i],
        Date:date
      }
      test.insert(faith,function(err,docs){
        if(docs){
          // console.log(docs)
          route.update({"BusNo":docs.BusNo},{$set:{"Strength":docs.Strength,"Standing":docs.Standing,"Intime":docs.Intime,"Remarks":docs.Remarks}}, function(err,docs1){
            // console.log(docs1)
          
         })
        }
        else{
          console.log(err)
        }
      })
    
    }
    res.redirect('/home')
    })
    
  })  

  //insert Mandapeta bus route data
  router.post('/insert-mandapeta-data', function(req,res){
    var date= moment().format('DD-MM-YYYY');  
    var bus=req.body.busno;
     var town=req.body.town;
     var rout=req.body.route;
     var code=req.body.code;
     var model=req.body.model;
     var capacity=req.body.capacity;
     var strength=req.body.strength;
     var standing=req.body.standing;
     var intime=req.body.intime;
     var remarks=req.body.remarks;
     route.count({"Town":"Mandapeta"},function(err,docs){
       var count=docs;
         
       for(i=0;i<=count-1;i++){
         var faith={
           BusNo:bus[i],
           Town:town[i],
           Route:rout[i],
           Code:code[i],
           Model:model[i],
           Capacity:capacity[i],
           Strength:strength[i],
           Standing:standing[i],
           Intime:intime[i],
           Remarks:remarks[i],
           Date:date
         }
         test.insert(faith,function(err,docs){
           if(docs){
             // console.log(docs)
             route.update({"BusNo":docs.BusNo},{$set:{"Strength":docs.Strength,"Standing":docs.Standing,"Intime":docs.Intime,"Remarks":docs.Remarks}}, function(err,docs1){
               // console.log(docs1)
               
            })
           
           }
           else{
             console.log(err)
           }
         })
       
       }
       res.redirect('/home') 
       })
       
     })
   

//inserting Others bus route data  
router.post('/insert-others-data', function(req,res){
  var date= moment().format('DD-MM-YYYY');  
 var bus=req.body.busno;
  var town=req.body.town;
  var rout=req.body.route;
  var code=req.body.code;
  var model=req.body.model;
  var capacity=req.body.capacity;
  var strength=req.body.strength;
  var standing=req.body.standing;
  var intime=req.body.intime;
  var remarks=req.body.remarks;
  route.count({"Town":"Others"},function(err,docs){
    var count=docs;
      
    for(i=0;i<=count-1;i++){
      var faith={
        BusNo:bus[i],
        Town:town[i],
        Route:rout[i],
        Code:code[i],
        Model:model[i],
        Capacity:capacity[i],
        Strength:strength[i],
        Standing:standing[i],
        Intime:intime[i],
        Remarks:remarks[i],
        Date:date
      }
      test.insert(faith,function(err,docs){
        if(docs){
          // console.log(docs)
          route.update({"BusNo":docs.BusNo},{$set:{"Strength":docs.Strength,"Standing":docs.Standing,"Intime":docs.Intime,"Remarks":docs.Remarks}}, function(err,docs1){
            // console.log(docs1)
            
         })
        
        }
        else{
          console.log(err)
        }
      })
    
    }
    res.redirect('/home') 
    })
    
  })
//edit Bus list data
router.post('/routeedit', function(req,res){
  var id=req.body.no;
  console.log(id);
   route.find({"_id":id}, function(err,docs){
    console.log(docs)
    res.send(docs)
  });
});

// taging the bus with tagid
router.get('/bus/:Tagid',function(req,res){
  var date= moment().format('DD-MM-YYYY')
  var Time= moment().format('h:mm:ss')
  console.log(date)
  console.log(Time)
  // console.log(s)
  // console.log(y)
  // console.log(d)
   bus.update({"Tagid":req.params.Tagid},{$set:{"Date":date,"Time":Time}}, function(err,docs){
     if(docs){
       // console.log(docs)
        bus.findOne({"Tagid":req.params.Tagid},function(err,docs2){
         if(docs){
           delete docs2._id
           delete docs2.IN
           delete docs2.OUT
           var s= docs2
          //  console.log(s)
           data.insert(s, function(err,docs3){
            //  console.log(docs)
            // console.log(docs.BusNo)
            var busno=docs3.BusNo
             res.send(docs3)
              bus.update({"BusNo":busno},{$set:{"IN":0,"OUT":0}}, {multi:true}, function(err,docs4){
               if(docs4){
                   // console.log(docs4)
                   
                    bus.findOne({"Date":date,"Time":Time,"Tagid":req.params.Tagid,"Status":"IN"}, function(err,docs5){
                     if(docs5){
                        // console.log(docs5)
                         bus.update({"BusNo":busno},{$set:{"IN":1,"OUT":0}},{multi:true})
                         route.update({"Code":busno},{$set:{"Intime":Time}}, function(err,docs7){
                          // console.log(docs7)
                         })
                        console.log("working in")
                     }
                     else{
                       // console.log("nooo")
                     }
                   })
                    bus.findOne({"Date":date,"Time":Time,"Tagid":req.params.Tagid,"Status":"OUT"}, function(err,docs6){
                    if(docs6){
                       // console.log(docs6)
                        bus.update({"BusNo":busno},{$set:{"IN":0,"OUT":1}},{multi:true})
                       console.log("working out")
                    }
                    else{
                      // console.log("not ever")
                    }
                  })
                   
               }
               else{
                 console.log(err)
               }
             })
           })
         }
         else{
           console.log("Not")
         }
       })
     }
     else{
       console.log(err)
     }
  })
  
})
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