// UserController.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();//Se usa para crear un subconjunto de rutas
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const Model = require('./Model');

    /*var obj = req.body.noticia;{url:'https://diariohoy.net',
           xpath:"body/div[1]/div[1]/div[1]/div[2]/section[1]/article[1]/a[1]/h2[1]",
           category:"Politica"
          };*/  
//var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';

// CREATES A NEW USER
router.post('/newUser', function (req, res) {
  	var name = req.body.name.toLowerCase(); //'gonza'
    //userId = req.body.userId

    // Create a new flow of contents with different kinds
    const array = [
                    {
                      url:"https://infocielo.com/",
                      xpath:"//*[@id='noticias-destacadas-1']/div[1]/article/a"                    },
                    {
                      url:"https://infocielo.com/",
                      xpath:"//*[@id='columna1_y_2']/div/div[2]/article[7]/a"                    },
                    {
                      url:"https://infocielo.com/politica",
                      xpath:"//*[@id='paginator_content']/article[1]/a"                    }
                  ]
    var userId = new mongoose.Types.ObjectId;
    Model.InfoContent.insertMany(array
    ,function(err,contents){
        console.log("----Contents:",contents)
        if (err) return res.status(500).send("No se pudieron asignar los contents para el usuario creado");

        const ids = contents.filter((elem,index) => { if(index < 2) return elem._id } );

        Model.Content.insertMany([
            { kind: 'SingleContent', identificador: 'infocielo', categoria:'Portada', content:contents[2]._id },
            { kind: 'SiblingContent', identificador: 'infocielo-hermanos', categoria:'Portada', siblings: ids }
          ],function(err,contents){
            const idC = contents.map((elem) => { return elem._id } );
            var flow = {
              _id: new mongoose.Types.ObjectId,
              user: userId,
              nombreConjunto:'Primero',
              contents: idC
            };
            Model.Flow.create( flow    
            ,function (err, flow) {
              console.log('---Flow: ',flow);
              if (err) return res.status(500).send("No se pudo asignar el flujo para el usuario creado");
              const flows = [flow._id];           
              console.log(flows)

              Model.User.create({name: name, _id:userId, flows: flows }//Hace el new y el save juntos
              //userId: userId, 
              //contenidos:array
              ,function (err, user) {
                          
                console.log("----Usuario:",user)
                if (err) return res.status(500).send("No se pudo agregar al usuario en la base");
                res.status(200).send(user);
              })
            })
        })
    })
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    Model.user.find({}, function (err, users) {
        if (err) return res.status(404).send("No se hallaron usuarios");
        res.status(200).send(users);
    });
});

// GETS THE FLOWS OF A SINGLE USER FROM THE DATABASE
router.get('/flows/:name', function (req, res) { //'/:usrid/:name'
    
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .populate({ path: 'flows', select: 'nombreConjunto -_id' })
    .exec(function(err,user){
      console.log('Flows %s ',user.flows)    
        //flows será un [] de 
        if (err | user.flows.length == 0) return res.status(404).send("No se hallaron flujos para ese usuario");
        res.status(200).send(user.flows);
      });
});

// GETS THE CATEGORIES OF A SINGLE USER 
router.get('/categories/:name', function (req, res) { //'/categories/:usrid/:name'
    
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .select('_id')
    .exec(function(err,userId){
        console.log('UserId %s ',userId)    
        //flows será un [] de 
        if (err | userId == null) return res.status(404).send("No se hallaron flujos para ese usuario");
        
        Model.Flow.find({'user': userId})//,{'contents.categoria -_id -contents.kind'},
        .populate({path:'contents',select:'categoria -_id'})
        //.select('contents.categoria -_id')
        .exec(function(err,flow){
            console.log('Categories %s ',flow)
            //juntar las categorias en un array (dos for each o usar aggregate)
            if (err | flow[0].contents.length == 0) return res.status(404).send("No se hallaron flujos para ese usuario");
            res.status(200).send(flow[0].contents);    
        })
    })
});

/* GETS THE CATEGORIES OF A SINGLE USER 
router.get('/categories/:name', function (req, res) { //'/categories/:usrid/:name'
      
    Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      Model.Content.find({'user_id':userId})
      .select('idConjunto -_id')
      .exec(function(err, flows) {
        //flows será un [] de idConjunto
        if (err | flows.length == 0) return res.status(404).send("No se hallaron flujos para ese usuario");
        console.log("Flujos: ",flows)
        res.status(200).send(flows);
      });  
    });

    Model.distinct('contenidos.category',{'name':req.params.name.toLowerCase()}, function(err, result){ //{'userId':req.params.usrid,
    if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(200).send("");
      console.log(result)
      res.status(200).send(result);
  });     
});*/


// GETS THE NOTICES OF ONE USER IN ORDER 
router.get('/noticesByOrder/:flow/:name', function (req, res) {

    Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      Model.Flow.aggregate(
           [
            { $unwind: "$contents"},
            { $match: {
                  'user_id': userId
                  //contents: {$elemMatch: {_id: flows[0]} }
                  //'contents.flow_id': flows[0]._id  //fijarse como hacer para comparar elementos de arrays
              }
            }
            ,
            //{ $sort : {"contenidos.order":1 }},
            {$group: {"_id":"$contents._id", "contenidos": {$push:"$contents._id"}}},
              { 
                  $project: {
                    contents:"$contenidos"
                  }
              }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result.contents)


              res.status(200).send(json);
            });
        
      });  

    /* 
        Model.Content.aggregate(
           [
            { $unwind: "$contents"},
            { $match: {
                  'user_id': userId,
                  contents: {$elemMatch: {flow_id: flows[0]} }
                  //'contents.flow_id': flows[0]._id  //fijarse como hacer para comparar elementos de arrays
              }
            }
            ,
            //{ $sort : {"contenidos.order":1 }},
            {$group: {"_id":"$user_id", "contenidos": {$push:"$contents"}}},
              { 
                  $project: {
                    contents:"$contenidos"
                  }
              }
           ])
        .exec(function (err,result) {
          console.log(result); // [ { maxBalance: 98000 } ]

          const newjson = json.concat(result[0].contents)
          res.status(200).send(result[0].contents);
        })*/
});

// GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/noticesByCategory/:category/:name', function (req, res) {

var getCriteria = {'name':req.params.name.toLowerCase()};

   Model.aggregate([
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
    Model.aggregate([
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


// GETS A SPECIFIC NOTICE OF ONE USER
router.get('/maxOrder/:name', function (req, res) { //'/notice/:usrid/:name'

    Model.aggregate([  
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


/* GETS THE SETS OF CONTENTS OF ONE USER 
router.get('/setsOfContents/:name', function (req, res) { //'/categories/:usrid/:name'
    Model.distinct('contenidos.idConjunto',{'name':req.params.name.toLowerCase()}, function(err, result){ //{'userId':req.params.usrid,
    if (err) return res.status(500).send("There was a problem finding the user.");
      if (!result || result.length == 0) return res.status(200).send("");
      console.log(result)
      res.status(200).send(result);
  });     
});

 GETS THE NOTICES OF ONE USER FILTER BY CATEGORY
router.get('/notices/:category/:name', function (req, res) { //'/notices/:category/:usrid/:name'

var getCriteria = {'name':req.params.name.toLowerCase()}; //{"userId":req.params.usrid,

   Model.aggregate([
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

// DELETES A USER FROM THE DATABASE
router.delete('/:name', function (req, res) { //'/:usrid/:name'
    Model.findOneAndRemove({"name":req.params.name.toLowerCase()}, function (err, user) { //{"userId":req.params.usrid,
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
        Model.update({'name':req.params.name.toLowerCase(),'contenidos.state': 'new'}, 
        {'$set': {
          'contenidos.$[elem].state': 'edited'
          }},{ "arrayFilters": [{ "elem.state": 'new' }], "multi": true }
        ,(err,doc)=>{
          //console.log("---contenido ",doc)
          res.status(200).send(doc);
        }) 
});

//UPDATE THE STATE OF A CONTENT 
router.put('/updateContent/user/:name',function(req, res) {

  Model.findOne({ name: req.params.name.toLowerCase()})//agregar password
  .select({ contenidos: {$elemMatch: {url:req.body.url,xpath:req.body.xpath}}})
  .exec((err, resul)=> { 
    //console.log("---contenido ",resul)
    var state = (resul.contenidos[0].state=='new')?'edited':'new';
    Model.findOneAndUpdate({'contenidos._id':resul.contenidos[0]._id} ,{ $set: { 'contenidos.$.state': state }},(err,doc)=>{
      //console.log("---contenido ",doc)
      res.status(200).send(doc);
    })
  }) 
});

//UPDATE A LIST OF CONTENTS
router.put('/updateListContents/user/:name', function (req, res) {
      /*Model.aggregate([  
      {$unwind : "$contenidos"},
      {
          "$match": {
              "name": req.params.name.toLowerCase()
          }
      },
      {
          "$group" : {
              "_id":"$_id",
              "maxOrder" : {"$max" : "$contenidos.idConjunto"},
              //"maxOrder" : {"$max" : "$contenidos.order"},
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
       var idC
       if(result.length > 0)
         idC = result[0].maxOrder + 1
       else
         idC = 1
      */
      var criteria = { 'name': req.params.name.toLowerCase()}
      Model.findOne(criteria)
            .select({ contenidos: 
                    {$elemMatch: 
                      {
                       idConjunto:req.body[0].idConjunto
                      }
                    }
                   })
            .exec((err, result)=> {
              console.log("result "+result)
              if (result.contenidos.length == 0){ //No existe el idConjunto
                var updates = req.body.map((item,index)=>{
                    console.log("item "+item.url+item.xpath+index)
                    return Model.update({'name':req.params.name.toLowerCase()}, 
                      {"$set": {
                        'contenidos.$[elem].order': index, //item.order
                        'contenidos.$[elem].state': "edited",
                        'contenidos.$[elem].idConjunto': item.idConjunto
                      }},{ "arrayFilters": [{$and:[{'elem.url':item.url},{'elem.xpath':item.xpath}]}]})       
                });

                Promise.all(updates).then((results)=>{
                    console.log(results);
                    res.status(200).send(req.body)
                });
              }else{
                    res.status(404).send("Ya existe un contenido con ese idConjunto")
              }
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

      Model.aggregate([  
      {$unwind : "$contenidos"},
      {
          "$match": {
              "name": req.params.name.toLowerCase()
          }
      },
      {
          "$group" : {
              "_id":"$_id",
              //"maxOrder" : {"$max" : "$contenidos.order"},
              "contents": { $push: "$contenidos"}
          }
      },
      { 
          $project: {
            contenidos:"$contents"
            //maxOrder:"$maxOrder"
          }
      }
    ])
    .then(function (result){
      	var contBody = req.body;
        var query = { 'name': req.params.name.toLowerCase()}//agregar password
    
       var contents = []
       let promises = contBody.map((elem,index)=>{ 
          console.log(elem,contBody)
          if(result.length > 0){
            if(!functionContains(result[0].contenidos,elem))//si no se repiten los contenidos
             return contents.push(elem)
          }
          return contents.push(elem)
       });
       
       Promise.all(promises).then((resultArray)=>{
          console.log("res",resultArray)
          if(contents.length == 0) return res.status(400).send("No puede haber contenidos con el mismo xpath o id de una misma pagina");      
          Model.findOneAndUpdate(query,{$push : {contenidos: {$each: contents} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
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
  Model.findOne(criteria)
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
          Model.findOne(criteria)
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
                Model.aggregate([  
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
                  Model.findOneAndUpdate(criteria, { $push: { contenidos: content }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
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
  
  Model.find(query,{'contenidos._id':0}, 
    function (err, result) {
       console.log(result[0].contenidos)
       var contents = []

       var elemAnt = {idContent:""};
       var elemAct;
       
       let promises = contBody.map((elem)=>{ 
        if(!functionContains(result[0].contenidos,elem)){//si no se repiten los contenidos
          return Model.aggregate([
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
          Model.findOneAndUpdate(query,{$push : {contenidos: {$each: contents} }}, function (err,user) {//{url:req.body.url,xpath:req.body.xpath}
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
Model.aggregate([
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