// UserController.js
var express = require('express');
var router = express.Router();//Se usa para crear un subconjunto de rutas
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';

// CREATES A NEW USER
router.post('/', function (req, res) {
	var name = req.body.name.toLowerCase(); //'gonza'
  userId = req.body.userId
	var array = [];
	/*var obj = req.body.noticia;{url:'https://diariohoy.net',
			   xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]",
			   category:"Politica"
			  };*/
	//array.push(obj);
	console.log(name,array);
    
    User.create({//Hace el new y el save juntos
            userId: userId, 
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
router.get('/notices/:category/:usrid/:name', function (req, res) {

var getCriteria = {'userId':req.params.usrid,'name':req.params.name.toLowerCase(),'contenidos.category':req.params.category};

User.find(getCriteria,{ '_id': 0,'contenidos.$' : 1},function(err, result){
    if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].contenidos)
      res.status(200).send(result[0].contenidos);
  });
  
});

// GETS THE NOTICES OF ONE USER FILTER BY STATE(new/old)
router.get('/notices/:state/:usrid/:name', function (req, res) {

var getCriteria = {'userId':req.params.usrid,'name':req.params.name.toLowerCase(),'contenidos.state':req.params.state};

User.find(getCriteria,{ '_id': 0,'contenidos.$' : 1},function(err, result){
    if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].contenidos)
      res.status(200).send(result[0].contenidos);
  });
  
});

// GETS THE CATEGORIES OF ONE USER 
router.get('/categories/:usrid/:name', function (req, res) {
    User.find({'userId':req.params.usrid,'name':req.params.name.toLowerCase()}, { '_id': 0, 'contenidos.category' :1}, function(err, result){
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].contenidos)
      res.status(200).send(result[0].contenidos);
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
router.get('/updateContent/user/:name/:category',function(req, res) {
  var userid;
  User.findOne({ name: req.params.name.toLowerCase(), category: req.params.category }, function (err, res) { 
  //docs contiene todos los documentos de un usuario con name :name
    console.log("---contenido ",res)
    res.status(200).send(res);
  }) 
}


//ADD A CONTENT INTO THE COLLECTION OF A USER
router.put('/addContent/user/:name',function(req, res) {
	//req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
	//req.body.url: 'https://diariohoy.net'
  //req.body.state = 'new'/'old'
	
	var userid;
	var array = [];//agregar passsword
	User.findOne({ name: req.params.name.toLowerCase() }, function (err, docs) { 
	//docs contiene todos los documentos de un usuario con name :name
		userid = docs[0].userId;
		array = docs[0].contenidos;
		array.push(req.body);//Agrego una nueva noticia a las que ya tenia el usuario

		var query = { userId: userid, name: req.params.name.toLowerCase() };
		User.findOneAndUpdate(query, { $set: { contenidos: array }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
				if(err) return res.status(500).send("There was a problem updating the user.");
				//user contiene el usuario antes de ser actualizado
				console.log('Actualizado ',user);
				
				res.status(200).send(user);
		});
	})
});

module.exports = router;