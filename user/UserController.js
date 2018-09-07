// UserController.js
var express = require('express');
var router = express.Router();//Se usa para crear un subconjunto de rutas
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

    /*var obj = req.body.noticia;{url:'https://diariohoy.net',
           xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]",
           category:"Politica"
          };*/  
//var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';

// CREATES A NEW USER
router.post('/', function (req, res) {
  	var name = req.body.name.toLowerCase(); //'gonza'
    //userId = req.body.userId
  	var array = []; 
    User.create({//Hace el new y el save juntos
            //userId: userId, 
            name: name,
            contenidos:array
        },function (err, user) {
            console.log("----Usuario:",user)
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:usrid/:name', function (req, res) {
    User.find({'userId':req.params.usrid,'name':req.params.name.toLowerCase()},{ '_id': 0, 'name' :1}, function (err, name) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!name || name.length == 0) return res.status(404).send("No user found.");
        console.log("Nombre",name);
        res.status(200).send(name);
    });
});

// GETS A SPECIFIC NOTICE OF ONE USER
router.get('/notice/:usrid/:name', function (req, res) {
    User.find({'userId':req.params.usrid,'name':req.params.name.toLowerCase()}, { '_id': 0, 'contenidos' :1}, function(err, result){
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].contenidos[0])
      res.status(200).send(result[0].contenidos[0]);
	});	    
});

// GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/noticesByCategory/:category/:usrid/:name', function (req, res) {

var getCriteria = {'userId':req.params.usrid,'name':req.params.name.toLowerCase(),'contenidos.category':req.params.category};

User.find(getCriteria,{ '_id': 0,'contenidos.$' : 1},function(err, result){
    if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].contenidos)
      res.status(200).send(result[0].contenidos);
  });
  
});

// GETS THE NOTICES OF ONE USER FILTER BY STATE(new/old)
router.get('/noticesByState/:state/:name', function (req, res) {

var getCriteria = {'name':req.params.name.toLowerCase(),'contenidos.state':req.params.state};
    User.distinct('contenidos.category',getCriteria, function(err, result){
    if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result)
      res.status(200).send(result);
  }); 

});

// GETS THE CATEGORIES OF ONE USER 
router.get('/categories/:usrid/:name', function (req, res) {
    User.distinct('contenidos.category',{'userId':req.params.usrid,'name':req.params.name.toLowerCase()}, function(err, result){
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result)
      res.status(200).send(result);
	});	    
});


// DELETES A USER FROM THE DATABASE
router.delete('/:usrid/:name', function (req, res) {
    User.findOneAndRemove({"userId":req.params.usrid,"name":req.params.name.toLowerCase()}, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ req.params.name +" was deleted.");
    });
});

//UPDATE THE STATE OF A CONTENT 
router.put('/updateContent/user/:name',function(req, res) {

  User.findOne({ name: req.params.name.toLowerCase()})//agregar password
  .select({ contenidos: {$elemMatch: {url:req.body.url,xpath:req.body.xpath}}})
  .exec((err, resul)=> { 
    //console.log("---contenido ",resul)
    var state = (resul.contenidos[0].state=='new')?'old':'new';
    User.findOneAndUpdate({'contenidos._id':resul.contenidos[0]._id} ,{ $set: { 'contenidos.$.state': state }},(err,doc)=>{
      //console.log("---contenido ",doc)
      res.status(200).send(doc);
    })
  }) 
});


//ADD A LIST OF CONTENT INTO THE COLLECTION OF A USER
router.put('/addListContent/user/:name',function(req, res) {
	//req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
	//req.body.url: 'https://diariohoy.net'
  //req.body.state = 'new'/'old'
	var contBody = req.body;
  var query = { 'name': req.params.name.toLowerCase()};//agregar password
  User.findOneAndUpdate(query,{$addToSet : {contenidos:{$each: contBody} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
    if(err) return res.status(500).send("There was a problem updating the user.");
    //user contiene el usuario antes de ser actualizado
    console.log('Actualizado ',user);
          
    res.status(200).send(user);
  })
})

//ADD A CONTENT INTO THE COLLECTION OF A USER
router.put('/addContent/user/:name',function(req, res) {
  //req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
  //req.body.url: 'https://diariohoy.net'
  //req.body.state = 'new'/'old'
  
  var query = { name: req.params.name.toLowerCase() };//agregar password
  User.findOne(query)
  .select({ contenidos: {$elemMatch: {url:req.body.url,xpath:req.body.xpath}}})
  .exec((err, docs)=> {
    console.log(docs)
    if(docs.contenidos.length>0)
      res.status(404).send("Ya existe el contenido para ese usuario");  
    else{//Si no existe el contenido
      User.findOneAndUpdate(query, { $push: { contenidos: req.body }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
          if(err) return res.status(500).send("There was a problem updating the user.");
          //user contiene el usuario antes de ser actualizado
          console.log('Actualizado ',user);
          
          res.status(200).send(user);
      });
    }
  })

});

module.exports = router;