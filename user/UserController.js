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
            console.log("----",user)
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(201).send(user);
        });
});
/*

//Modificar una noticia de un usuario 
router.put('/update/user/:name',function(req, res) {
	//req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
	//req.body.url: 'https://diariohoy.net'
	console.log(req.params.name)
	var userid;
	User.scan('name').contains(req.params.name).exec(function (err, usuarios) {
	  
	  userid=usuarios[0].userid;
	  var array = usuarios[0].noticias;
	  var encontro;
	  array.forEach(function(elem){
	  	if( JSON.stringify(req.body) != JSON.stringify(elem)){	  	
	  	  encontro = true;
	  	}
	  });
	  if(encontro){ //Si la noticia es distinta a las que ya tenia el usuario
		  array.push(req.body);
		  console.log('array ' + array,usuarios[0].noticias);
		  User.update({userid: userid, name: req.params.name}, {noticias: array}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
			if(err) { return console.log(err); }
			console.log('Actualizado ',req.body);
			
			res.send(user);
		  })
	  }else{
		res.send("Ya existe la noticia para ese usuario");	
	  }
	});
	/*User.get('amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY','gonza').then(function (usuario) {
	  //console.log('Usuario ' + usuario.userid);
	  userid=usuario.userid;
	})
  });


// GETS A SINGLE USER FROM THE DATABASE
router.get('/:usrid/:name', function (req, res) {
	//var usrid ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';	
	//name=gonza
	User.get({userid:req.params.usrid,name:req.params.name},function(err, usuario) {
	  if(err) { return console.log(err); }
	  if (!usuario) return res.send(404,"No se encontro el usuario ",req.params.name);
	  console.log('Usuario: ' + usuario.name);
	  res.send(200,usuario);
	});
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {

	
	User.scan('name').contains('gonza').exec(function (err, users) {
        if (err) return res.send(500,"There was a problem finding the users.");
        //console.log(users[0].userid)
        res.status(200).send(users);
	});
	
	/*
		var usuario = User.update({id: '60',name:'gonza'}, {id:'600'}, function (err) {
  	if(err) { return console.log(err); }
  		console.log('Just a puppy');
	})
	
	var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';
	var usuario = new User({userid: userId, name: 'gonza',url:'https://diariohoy.net',xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]"});


	usuario.save(function (err) {
	  if(err) { return console.log(err); }
	  console.log('Guardado');
	});

});

// DELETES A USER FROM THE DATABASE
router.delete('/:usrid', function (req, res) {
    User.delete({userid: req.params.usrid, name: 'gonza'}, function(err) {
	  if(err) { return console.log(err); }
	  console.log('Usuario eliminado ',req.params.usrid);
	  res.status(200).send('Usuario eliminado')
	});
    /*User.findByIdAndRemove(req.params.usrid, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.name +" was deleted.");
    });
    
});

*/
module.exports = router;