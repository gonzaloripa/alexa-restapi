// UserController.js
var express = require('express');
var router = express.Router();//Se usa para crear un subconjunto de rutas
var bodyParser = require('body-parser');
const fetch = require('node-fetch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

    /*var obj = req.body.noticia;{url:'https://diariohoy.net',
           xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]",
           category:"Politica"
          };*/  
//var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';

router.get('/prueba',function(req,res){
  const fetch = require('node-fetch');
  //No devuelve el titulo en washingtonTimes
  function getTitleContent(noticia){
      var xpath = require('xpath')
      ,dom = require('xmldom').DOMParser;
      console.log("-------Noticia ",noticia,noticia.url,noticia.xpath)
      var title;
      fetch(noticia.url)
      .then( response => {
          //console.log("--Response: ",response) 
          return response.text()
      })
      .then(body => {
          //console.log("---Body: ",body)    
          var docu = new dom().parseFromString(body,'text/html')
          //console.log("---Body: ",docu)    
          var getElementByXpath = function(path) {
              console.log("-------Path en getElement: ",xpath.select(path,docu)[0].nodeValue);
              //console.log("-------Evaluate: ",xpath.evaluate(path, docu, null, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.lastChild.data);
              return (xpath.select(path,docu)[0].nodeValue);
          }
          //console.log("----Element a ",findElementA(getElementByXpath("//"+noticia.xpath)).attributes[1].nodeValue)
          
          try{
              title = getElementByXpath("//"+noticia.xpath).textContent
                      
          }catch(e){
              console.log("---error en get title ",e)
              title = "The path of the content has changed"
          }

          console.log("---Title",title)
         
      })
  }
  
  [{
                "url": "https://diariohoy.net/",
                "xpath": "body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]"
                },
            {
                
                "url": "https://infocielo.com/deportes/estudiantes/",
                "xpath": "body/div[1]/section[1]/article[1]/a[1]/div[1]/h1[1]"
                
            }].map((noticia)=>{
              getTitleContent(noticia)
            })
})


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
router.get('/:name', function (req, res) { //'/:usrid/:name'
    User.find({'name':req.params.name.toLowerCase()},{ '_id': 0, 'name' :1}, function (err, name) { //{"userId":req.params.usrid,
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!name || name.length == 0) return res.status(404).send("No user found.");
        console.log("Nombre",name);
        res.status(200).send(name);
    });
});

// GETS A SPECIFIC NOTICE OF ONE USER
router.get('/maxOrder/:name', function (req, res) { //'/notice/:usrid/:name'

    User.aggregate([  
      {$unwind : "$contenidos"},
      {
          "$match": {
              "name": req.params.name.toLowerCase()
          }
      },
      {
          "$group" : {
              "_id":"$_id",
              "maxOrder" : {"$max" : "$contenidos.order"},
              "contents": { $push: "$contenidos"}
          }
      },
      { 
          $project: {
            contenidos:"$contents",
            maxOrder:"$maxOrder"
          }
      }
    ]).then(function (result){
      console.log(result)
      res.status(200).send(result);
    })
});

/*/ GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/notices/:category/:name', function (req, res) { //'/notices/:category/:usrid/:name'

var getCriteria = {'name':req.params.name.toLowerCase()}; //{"userId":req.params.usrid,

   User.aggregate([
    { $match: getCriteria},
    { $project: {
        contenidos: {$filter: {
            input: '$contenidos',
            as: 'item',
            cond: {$eq: ['$$item.category', req.params.category]}
        }}
    }}
    ]).then(function (result) {
      console.log(result[0].contenidos); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contenidos);
    });
  
});
*/

// GETS THE NOTICES OF ONE USER IN ORDER 
router.get('/noticesByOrder/:name', function (req, res) {
    
    var getCriteria = {'name':req.params.name.toLowerCase()}//,'contenidos.state':req.params.state};
    User.aggregate(
       [
        {$unwind: "$contenidos"},
        { $match: getCriteria },
        { $sort : { "contenidos.order": 1}},
        {$group: {_id:"$_id", contents: {$push:"$contenidos"}}}
       ])
    .then(function (result) {
      console.log(result); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contents);
    })
});

// GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/noticesByCategory/:category/:name', function (req, res) {

var getCriteria = {'name':req.params.name.toLowerCase()};

   User.aggregate([
    { $match: getCriteria},
    { $project: {
        contenidos: {$filter: {
            input: '$contenidos',
            as: 'item',
            cond: {$eq: ['$$item.category', req.params.category]}
        }}
    }}
    ]).then(function (result) {
      console.log(result[0].contenidos); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contenidos);
    });
  
});

// GETS THE NOTICES OF ONE USER FILTER BY STATE(new/old)
router.get('/noticesByState/:state/:name', function (req, res) {

    var getCriteria = {'name':req.params.name.toLowerCase()}//,'contenidos.state':req.params.state};
    User.aggregate([
    { $match: getCriteria},
    { $project: {
        contenidos: {$filter: {
            input: '$contenidos',
            as: 'item',
            cond: {$eq: ['$$item.state', req.params.state]}
        }}
    }}
    ]).then(function (result) {
      console.log(result[0].contenidos); // [ { maxBalance: 98000 } ]
      res.status(200).send(result[0].contenidos);
    });

});

// GETS THE CATEGORIES OF ONE USER 
router.get('/categories/:name', function (req, res) { //'/categories/:usrid/:name'
    User.distinct('contenidos.category',{'name':req.params.name.toLowerCase()}, function(err, result){ //{'userId':req.params.usrid,
	  if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(200).send("");
      console.log(result)
      res.status(200).send(result);
	});	    
});


// DELETES A USER FROM THE DATABASE
router.delete('/:name', function (req, res) { //'/:usrid/:name'
    User.findOneAndRemove({"name":req.params.name.toLowerCase()}, function (err, user) { //{"userId":req.params.usrid,
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ req.params.name +" was deleted.");
    });
});

// DELETES A CONTENT FROM A USER 
router.delete('/deleteContent/:name', function (req, res) { //'/:usrid/:name'
 
});

//UPDATE THE STATE OF GROUP OF CONTENTS
router.put('/updateContentsByState/user/:name', function (req, res) {

        //var getCriteria = {'name':req.params.name.toLowerCase()}//,'contenidos.state':req.params.state};    
        //console.log(result[0]);
        User.update({'name':req.params.name.toLowerCase(),'contenidos.state': 'new'}, 
        {'$set': {
          'contenidos.$[elem].state': 'edited'
          }},{ "arrayFilters": [{ "elem.state": 'new' }], "multi": true }
        ,(err,doc)=>{
          //console.log("---contenido ",doc)
          res.status(200).send(doc);
        }) 
});


//UPDATE A LIST OF CONTENTS
router.put('/updateListContents/user/:name', function (req, res) {

        var updates = req.body.map((item)=>{
            return User.update({'name':req.params.name.toLowerCase()}, 
              {"$set": {
                'contenidos.$[elem].order': item.order
              }},{ "arrayFilters": [{$and:[{'elem.url':item.url},{'elem.xpath':item.xpath}]}]})       
        });

        Promise.all(updates).then((results)=>{
            console.log(results);
            res.status(200).send(req.body)
        }); 
});


//UPDATE THE STATE OF A CONTENT 
router.put('/updateContent/user/:name',function(req, res) {

  User.findOne({ name: req.params.name.toLowerCase()})//agregar password
  .select({ contenidos: {$elemMatch: {url:req.body.url,xpath:req.body.xpath}}})
  .exec((err, resul)=> { 
    //console.log("---contenido ",resul)
    var state = (resul.contenidos[0].state=='new')?'edited':'new';
    User.findOneAndUpdate({'contenidos._id':resul.contenidos[0]._id} ,{ $set: { 'contenidos.$.state': state }},(err,doc)=>{
      //console.log("---contenido ",doc)
      res.status(200).send(doc);
    })
  }) 
});


//ADD A LIST OF CONTENT INTO THE COLLECTION OF A USER
router.put('/addListContent/user/:name',function(req, res) {
  var functionContains = function(array,obj){
    for (i = 0; i < array.length; i++) {
            //console.log("  aver ",(array[i] == obj),array[i],obj)
            if (array[i].xpath === obj.xpath && array[i].url === obj.url ) 
                return true
        }
        return false;
  };

	var contBody = req.body;
  var query = { 'name': req.params.name.toLowerCase()};//agregar password
    User.aggregate([  
      {$unwind : "$contenidos"},
      {
          "$match": {
              "name": req.params.name.toLowerCase()
          }
      },
      {
          "$group" : {
              "_id":"$_id",
              "maxOrder" : {"$max" : "$contenidos.order"},
              "contents": { $push: "$contenidos"}
          }
      },
      { 
          $project: {
            contenidos:"$contents",
            maxOrder:"$maxOrder"
          }
      }
    ])
    .then(function (result){

       var contents = []
       let promises = contBody.map((elem,index)=>{ 
        console.log(elem,contBody)
        if(result.length > 0){
          if(!functionContains(result[0].contenidos,elem))//si no se repiten los contenidos
            elem.order = result[0].maxOrder + index + 1
        }else{
          elem.order = index
        }
        return contents.push(elem);
       });
       
       Promise.all(promises).then((resultArray)=>{
          console.log("res",resultArray)
          if(contents.length == 0) return res.status(400).send("No puede haber contenidos con el mismo xpath o id de una misma pagina");      
          User.findOneAndUpdate(query,{$push : {contenidos: {$each: contents} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
          //user contiene el usuario antes de ser actualizado
          console.log('Actualizado ',user);
          res.status(200).send(contents);
        })
       }).catch((err)=>{
        console.log("error",err)
       })   
    }) 
});

//ADD A CONTENT INTO THE COLLECTION OF A USER
router.put('/addContent/user/:name',function(req, res) {
  //req.body.xpath:body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]
  //req.body.url: 'https://diariohoy.net'
  //req.body.state = 'new'/'old'
  
  var criteria = { name: req.params.name.toLowerCase() };//agregar password
  User.findOne(criteria)
  .select({ contenidos: 
          {$elemMatch: 
            {url:req.body.url,
             xpath:req.body.xpath
            }
          }
         })
  .exec((err, docs)=> {
    console.log(docs)
    if(docs.contenidos.length > 0)
      res.status(404).send("Ya existe el contenido para ese usuario");  
    else{//Si no existe el contenido
          User.findOne(criteria)
            .select({ contenidos: 
                    {$elemMatch: 
                      {url:req.body.url,
                       idContent:req.body.idContent
                      }
                    }
                   })
            .exec((err, result)=> {
              console.log(result)
              if(result.contenidos.length > 0)
                res.status(404).send("Ya existe el id");  
              else{
                User.aggregate([  
                  {$unwind : "$contenidos"},
                  {
                      "$match": {
                          "name": req.params.name.toLowerCase()
                      }
                  },
                  {
                      "$group" : {
                          "_id":"$_id",
                          "maxOrder" : {"$max" : "$contenidos.order"}
                      }
                  }
                ]).then(function (elem){
                  console.log(elem)
                  const content = req.body
                  if(elem.length > 0)
                    content.order = parseInt(elem[0].maxOrder) + 1
                  else
                    content.order = 0
                  User.findOneAndUpdate(criteria, { $push: { contenidos: content }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
                    if(err) return res.status(500).send("There was a problem updating the user.");
                    //user contiene el usuario antes de ser actualizado
                    console.log('Actualizado ',content);
                    
                    res.status(200).send(content);
                  })
                })
                
              }
            })
      }
  })
});

module.exports = router;




/*addListContent

var functionContains = function(array,obj){
    for (i = 0; i < array.length; i++) {
            //console.log("  aver ",(array[i] == obj),array[i],obj)
            if (array[i].xpath === obj.xpath && array[i].url === obj.url) {
                return true
            }
        }
        return false;
  };

  var contBody = req.body;
  var query = { 'name': req.params.name.toLowerCase()};//agregar password
  
  User.find(query,{'contenidos._id':0}, 
    function (err, result) {
       console.log(result[0].contenidos)
       var contents = []

       var elemAnt = {idContent:""};
       var elemAct;
       
       let promises = contBody.map((elem)=>{ 
        if(!functionContains(result[0].contenidos,elem)){//si no se repiten los contenidos
          return User.aggregate([
             {$unwind:"$contenidos"},
             {$match:{"contenidos.idContent":elem.idContent, "contenidos.url":elem.url}},
             {$project:{contenidos:1,_id:0}},
             {$sort:{"contenidos.idInc":-1}},
             {$limit: 1}
             ])
          .then(function (result) {
            console.log(result[0]); 
              
              if(result[0])
                elem.idInc = result[0].contenidos.idInc + 1 //.replace(/(\d+)/,function(j,a){return a- -1;}) //incrementa el valor del identificador
              else 
                elem.idInc = 1;
              contents.push(elemAct);
            })
        }
       });
       Promise.all(promises).then((resultArray)=>{
        console.log("res",resultArray)
          User.findOneAndUpdate(query,{$push : {contenidos: {$each: contents} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
          if(err) return res.status(500).send("There was a problem updating the user.");
          //user contiene el usuario antes de ser actualizado
          console.log('Actualizado ',user);
                
          res.status(200).send(contents);
        })
       }).catch((err)=>{
        console.log("error",err)
       })   
    }) 





addContent/user/name
User.aggregate([
         {$unwind:"$contenidos"},
         {$match:{"contenidos.idContent":req.body.idContent, "contenidos.url":req.body.url}},
         {$project:{contenidos:1,_id:0}},
         {$sort:{"contenidos.idInc":-1}},
         {$limit: 1}
         ])
      .then(function (result) {
        console.log(result[0]); 
        var aux=req.body;
          if(result[0])
            aux.idInc = result[0].contenidos.idInc + 1 //.replace(/(\d+)/,function(j,a){return a- -1;}) //incrementa el valor del identificador
          else
            aux.idInc = 1   //aux.idContent+1



*/