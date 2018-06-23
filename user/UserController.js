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
	var name = req.body.name; //'gonza'
	var array = [];
	var obj = req.body.noticia;/*{url:'https://diariohoy.net',
			   xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]",
			   category:"Politica"
			  };*/
	array.push(obj);
	console.log(name,array);
    
    User.create({//Hace el new y el save juntos
            userId: userId, 
            name: name,
            noticias:array
        },function (err, user) {
            console.log("----Usuario:",user)
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(201).send(user);
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
        if (!name) return res.status(404).send("No user found.");
        console.log("Nombre",name);
        res.status(200).send(name);
    });
});

// GETS A SPECIFIC NOTICE OF ONE USER
router.get('/notice/:usrid/:name', function (req, res) {
    User.find({'userId':req.params.usrid,'name':req.params.name.toLowerCase()}, { '_id': 0, 'noticias' :1}, function(err, result){
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].noticias[0])
      res.status(200).send(result[0].noticias[0]);
	});	    
});

// GETS THE NOTICES OF ONE USER
router.get('/notices/:usrid/:name', function (req, res) {
    User.find({'userId':req.params.usrid,'name':req.params.name.toLowerCase()}, { '_id': 0, 'noticias' :1}, function(err, result){
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(404).send("No user found.");
      console.log(result[0].noticias)
      res.status(200).send(result[0].noticias);
	});	    
});

// DELETES A USER FROM THE DATABASE
router.delete('/:usrid/:name', function (req, res) {
    User.findOneAndRemove({"userId":req.params.usrid,"name":req.params.name.toLowerCase()}, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.name +" was deleted.");
    });
});

//ADD A NOTICE INTO THE COLLECTION OF A USER
router.put('/update/user/:name',function(req, res) {
	//req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
	//req.body.url: 'https://diariohoy.net'
	
	var userid;
	var array = [];
	User.find({ name: req.params.name.toLowerCase() }, function (err, docs) { 
	//docs contiene todos los documentos de un usuario con name :name
		userid = docs[0].userId;
		array = docs[0].noticias;
		array.push(req.body);//Agrego una nueva noticia a las que ya tenia el usuario

		var query = { userId: userid, name: req.params.name.toLowerCase() };
		User.findOneAndUpdate(query, { $set: { noticias: array }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
				if(err) return res.status(500).send("There was a problem updating the user.");
				//user contiene el usuario antes de ser actualizado
				console.log('Actualizado ',user);
				
				res.status(200).send(user);
		});
	})
});

module.exports = router;