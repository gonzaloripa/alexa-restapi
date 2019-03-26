// UserController.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();//Se usa para crear un subconjunto de rutas
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const Model = require('./Model');
//var userId ='amzn1.ask.account.AEM7C7O3S3FKO4J77F7YYBP5CXPUVG4VHEW4MM77YUETWFCQAMJE4PTXRJCZAJTWC2FKIP3MEVBILLNA2TK7VDHVBHBDA7ZSFLFRYWYE2U4WBV64CWFAKL74DHSBJ3KHY2VPD6HY7G5AWN5XUUIQCJYOQ3VAMD32MKA63PW5ZEDG5F2AXOIL5VNSGPKZZDY3IFDK4V75RD4CKYY';

//var session = require('express-session');
//router.use(session({secret:'ALEXA'}));

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
var content = null
//var failedContents = []
var ready = false;


myEmitter.on('initEvent', () => {
  console.log('The first content is ready')
  ready = true
})

myEmitter.on('secondEvent', (content) => {
  console.log('The contents are ready')
  //if( failedContents.length != contents.length )
  if(content != null)
    ready = true
})



//--------------------------  ROUTES -----------------------------------

/* SKILL
* 
* Ver si agregar un request (o manejarlo desde la skill) para que, 
* una vez obtenidos todos los contents, 
* solo los ordene por el criterio que diga el usuario, 
* sin tener que mandar request todo el tiempo a esta API para obtener por Nightmare 
* los mismos contents. (asociar info con criterios en un map) 
*
*/
/*
router.get('/prueba',function(req,res){
    req.session.content = "NUEVO"
    console.log(req.session)
});
*/
router.post('/nextTitle/', function(req,response){
  //req.body = [{},{}]
  response.status(200).send("Llego el aviso")
  //failedContents=[]
  //var content = req.session.content
  var cont = req.body.contenidos //cont= [{url,xpath,_id},{}]
  
  console.log("body ",cont)

  //cont.forEach(async(content,index,array)=>{
                       //nightmare-herokuapp
  fetch("https://headless-chrome-alexa.herokuapp.com/getTitle?url="+cont.url+"&path="+cont.xpath)
      .then(res => {
          console.log("devuelve "+res.ok)
          if(res.ok)
            return res.json()
      })
      .then(json => {
          //if(!json)
           //failedContents.push(index) 
          //contents[index]= json //json={title,intro}
          content = json
          console.log("content ",json)
          myEmitter.emit('secondEvent',json)
          /*itemsProcessed++;
          if(itemsProcessed === array.length)
            await fetch("https://headless-chrome-alexa.herokuapp.com/closeBrowser")
            .then(res => {
              myEmitter.emit('secondEvent')
            }) 
          */          
      })

})


router.post('/nextRequest/', function(req,response){
  response.status(200).send("Llego el aviso")
  var cont = req.body.contenidos //cont= [{url,xpath,_id},{}]
  console.log("body ",cont)
  
  fetch("https://headless-chrome-alexa.herokuapp.com/getBodyContent?url="+cont.url+"&path="+cont.xpath)
    .then(res => {
        console.log("devuelve "+res.ok)
        if(res.ok)
          return res.json()
    })
    .then(json => {
        content = json //json={contenido,host,title,intro}
        console.log("contents ",content)
        myEmitter.emit('secondEvent',json) 
  })
})

router.get('/getContents', function(req,response){
  if(ready == true){
    ready = false
    response.status(200).send(content) 
  }
  else{
    response.status(304).send("The contents are not ready")   
  }
})

// CREATES A NEW USER
router.post('/newUser', function (req, res) {
  	var name = req.body.name.toLowerCase(); //'gonza'
    //userId = req.body.userId

    // Create a new flow of contents with different kinds
    const array = [
                    {
                      url:"https://infocielo.com/",
                      xpath:"//*[@id='noticias-destacadas-2']/div[1]/div[1]/article/a"
                    },
                    {
                      url:"https://infocielo.com/",
                      xpath:"//*[@id='noticias-destacadas-2']/div[1]/div[2]/article/a"
                    },
                    {
                      url:"https://infocielo.com/",
                      xpath:"//*[@id='modulo_especial_2']/div[2]/article/a"
                    }
                  ]
    var userId = new mongoose.Types.ObjectId;
    Model.InfoContent.insertMany(array
    ,function(err,contents){
        console.log("----Contents:",contents)
        if (err) return res.status(500).send("No se pudieron asignar los contents para el usuario creado");

        //const ids = contents.filter((elem,index) => { if(index < 2) return elem._id } ); 
        const ids = []; 
        contents.forEach((elem,index) => { if(index < 2) ids.push(elem._id) } ); 

        console.log("----ids:",ids)

        Model.Content.create([
            { kind: 'SingleContent', user:userId, identificador: 'infocielo', categoria:'Portada', content:contents[2]._id },
            { kind: 'SiblingContent', user:userId, identificador: 'infocielo-hermanos', categoria:'Portada', siblings: ids }
          ],function(err,contents){
            console.log("--diferent ",contents)
            const idC = contents.map((elem,index) => { return {_id:elem._id,order:index } } );
            const idC2 = [{_id:contents[1]._id,order:0},{ _id:contents[0]._id,order:1}]
            console.log("conj ", idC, idC2)
            var flows = [{
              _id: new mongoose.Types.ObjectId,
              user: userId,
              nombreConjunto:'Primero',
              pattern:'Read only titles',
              contents: idC
            },{
              _id: new mongoose.Types.ObjectId,
              user: userId,
              nombreConjunto:'Segundo',
              pattern:'Read introduction and content',
              contents: idC2
            }];
            Model.Flow.insertMany(flows    
            ,function (err, flows) {
              console.log('---Flow: ',flows);
              if (err) return res.status(500).send("No se pudo asignar el flujo para el usuario creado");
              const idFlows = flows.map((elem) => { return elem._id } );          
              console.log(idFlows)

              Model.User.create({name: name, _id:userId, flows: idFlows }//Hace el new y el save juntos
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
    Model.User.find({}, function (err, users) {
        if (err) return res.status(404).send("No se hallaron usuarios");
        res.status(200).send(users);
    });
});

// RETURNS A USER FILTER BY NAME
router.get('/:name', function (req, res) {
    Model.User.find({ name:req.params.name }, function (err, user) {
        if (err) return res.status(404).send("No se hallo ningún usuario con ese nombre");
        res.status(200).send(user[0].name);
    });
});

// GETS THE FLOWS OF A SINGLE USER FROM THE DATABASE
router.get('/flows/:name', function (req, res) { //'/:usrid/:name'
    
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .populate({ path: 'flows', select: 'nombreConjunto pattern -_id' })
    .exec(function(err,user){
      console.log('Flows %s ',user.flows)    
        //flows será un [] de 
        if (err | user.flows.length == 0) return res.status(404).send("No se hallaron flujos para ese usuario");
        res.status(200).send(user.flows);
      });
});

// GETS THE FIRST CATEGORY OF A SINGLE USER 
router.get('/getFirstCategory/:name', function (req, res) { //'/categories/:usrid/:name'
    
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .select('_id')
    .exec(function(err,userId){
        console.log('UserId %s ',userId)    
        //flows será un [] de 
        if (err | userId == null) return res.status(404).send("No se hallaron flujos para ese usuario");
              Model.Content.find({'user': userId})
              .select('categoria -_id')
              .limit(1)
              .exec(function(err,resul){
                if (err | resul.length == 0) return res.status(404).send("No se hallaron categorias para ese usuario");
                res.status(200).send(resul);
              })  
        })
});

// GETS THE CATEGORIES OF A SINGLE USER 
router.get('/categories/:name', function (req, res) { //'/categories/:usrid/:name'
    
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .select('_id')
    .exec(function(err,userId){
        console.log('UserId %s ',userId)    
        //flows será un [] de 
        if (err | userId == null) return res.status(404).send("No se hallaron flujos para ese usuario");

        /*Model.Flow.find({'user': userId})//,{'contents.categoria -_id -contents.kind'},
        .populate({path:'contents',select:'categoria'})
        //.select('contents.categoria -_id')
        .exec(function(err,flow){
            try{
              console.log('Categories %s ',flow)
              if (err | flow[0].contents.length == 0) return res.status(404).send("No se hallaron categorias para ese usuario");

              var idC = []; 
              flow.map((f) => {
                console.log("flujos ",f)
                f.contents.map((elem) => {
                  console.log(elem)
                  idC.push(elem._id)})
              });
              console.log(idC)*/
              Model.Content.distinct('categoria',{'user': userId},function(err,resul){
                if (err | resul.length == 0) return res.status(404).send("No se hallaron categorias para ese usuario");
                res.status(200).send(resul);
              })  
        })
});


// (ADMIN) GETS THE NOTICES OF ONE USER IN ORDER FILTERED BY FLOW
router.get('/admin/contentsByOrder/:flow/:name', function (req, res) {

    Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Flow.aggregate(
           [
            { $match: { nombreConjunto: req.params.flow, user:new mongoose.Types.ObjectId(userId._id) }},
            { $unwind: '$contents' },
            { $lookup: {
                from: 'contents',
                localField: 'contents._id',
                foreignField: '_id',
                as: 'conj'
              }
            },
            { $unwind: '$conj' },
            { $project: 
              {
                'user':1,
                'nombreConjunto':1,
                'contenidos':{
                  '_id':'$contents._id',
                  'order':'$contents.order',
                  'info':'$conj'
                }
              } 
            },
            /*
            { $addFields: {"content": {"$mergeObjects": ["$contents", "$conj"]} } }, 
            /*{
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$conj", 0 ] }, "$$ROOT" ] } }
            },
            { $group: {
                _id: '$_id',
                contenidos: {$push: '$conj'}
              }
            },
            { $unwind: '$contenidos'},*/
            { $group: {
                _id: '$_id',
                cont: { $push: {
                    $cond: { if: { $eq: ['$contenidos.info.kind', 'SingleContent' ] }, then: [{contentId:'$contenidos.info.content',identificador:'$contenidos.info.identificador',categoria:'$contenidos.info.categoria',available:'$contenidos.info.available', order:'$contenidos.order'}] , else: [{siblingsId:'$contenidos.info.siblings', identificador:'$contenidos.info.identificador', categoria:'$contenidos.info.categoria',available:'$contenidos.info.available',order:'$contenidos.order'}]  
                           } 
                        } 
                      }
              }
            },
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$cont',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },/*
            { $unwind: '$combinedC'},/*
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$combined',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },
            { $unwind: '$combinedC'},/*
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC.',
                foreignField: '_id',
                as: 'infocontents'
              }
            },*/
            {
              $project:{
                //conj:0,
                combinedC:1,
                _id:0
              }
            },
            { 
              $sort: {'combinedC.order': 1 }
            }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result[0].combinedC);
        });
        
  });
})  

// (ADMIN) GETS THE NOTICES OF ONE USER FILTERED BY CATEGORY
router.get('/admin/contentsByCategory/:category/:name', function (req, res) {

  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Content.aggregate(
           [
            { $match: {user:new mongoose.Types.ObjectId(userId._id), categoria:req.params.category }},
            //{ $match: { '$contenidos.categoria':req.params.category }},
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: { $eq: ['$kind', 'SingleContent' ] }, then: [{contentId:'$content',identificador:'$identificador',categoria:'$categoria',available:'$available'}] , else: [{siblingsId:'$siblings', identificador:'$identificador', categoria:'$categoria',available:'$available'}]  
                           }  
                        } 
                      }
              }
            },            
            { $unwind: '$contenidos'},/*
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$contenidos',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
              
            { $unwind: '$combinedC'},
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC',
                foreignField: '_id',
                as: 'infocontents'
              }
            },*/
            {
              $project:{
                contenidos:1,
                //combinedC:1,
                _id:0
              }
            }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result);
        })
        
  })
});

// (ADMIN) GETS THE NOTICES OF ONE USER FILTERED BY CATEGORY
router.get('/admin/contentsByFirstCategory/:name', function (req, res) {

  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Content.find({user:new mongoose.Types.ObjectId(userId._id)})
      .select('categoria -_id')
      .limit(1)
      .exec(function(err,category){
        console.log(category)
          Model.Content.aggregate(
           [
            { $match: {user:new mongoose.Types.ObjectId(userId._id), categoria:category[0].categoria }},
            //{ $match: { '$contenidos.categoria':req.params.category }},
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: { $eq: ['$kind', 'SingleContent' ] }, then: [{contentId:'$content',identificador:'$identificador',categoria:'$categoria', available:'$available'}] , else: [{siblingsId:'$siblings', identificador:'$identificador', categoria:'$categoria', available:'$available'}]  
                           }  
                        } 
                      }
              }
            },            
            { $unwind: '$contenidos'},/*
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$contenidos',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
              
            { $unwind: '$combinedC'},
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC',
                foreignField: '_id',
                as: 'infocontents'
              }
            },*/
            {
              $project:{
                contenidos:1,
                //combinedC:1,
                _id:0
              }
            }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result);
        })
      })        
  })
});

// (ADMIN) GETS ALL THE NOTICES AND FLOWS OF ONE USER
router.get('/admin/contentsAndFlows/:name', function (req, res) {
  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Flow.aggregate(
           [
            { $match: { user:new mongoose.Types.ObjectId(userId._id) }},
            { $unwind: '$contents' },
            { $lookup: {
                from: 'contents',
                localField: 'contents._id',
                foreignField: '_id',
                as: 'conj'
              }
            },
            { $unwind: '$conj' },
            { $project: 
              { 
                'user':1,
                'nombreConjunto':1,
                'contenidos':{
                  '_id':'$contents._id',
                  'order':'$contents.order',
                  'info':'$conj'
                }
              } 
            },/*
            /*
            { $addFields: {"content": {"$mergeObjects": ["$contents", "$conj"]} } }, 
            /*{
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$conj", 0 ] }, "$$ROOT" ] } }
            },
            { $group: {
                _id: '$_id',
                contenidos: {$push: '$conj'}
              }
            },
            { $unwind: '$contenidos'},
            */{ $group: {
                _id: '$_id',
                cont: { $push: {
                    $cond: { if: { $eq: ['$contenidos.info.kind', 'SingleContent' ] }, then: [{contentId:'$contenidos.info.content',identificador:'$contenidos.info.identificador',categoria:'$contenidos.info.categoria', order:'$contenidos.order',flujo:'$nombreConjunto'}] , else: [{contentId:'$contenidos.info.siblings', identificador:'$contenidos.info.identificador', categoria:'$contenidos.info.categoria',order:'$contenidos.order',flujo:'$nombreConjunto'}]  
                           } 
                        } 
                      }
              }
            },
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$cont',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },
            { $unwind: '$combinedC'},/*
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$combined',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },
            { $unwind: '$combinedC'},/*
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC.',
                foreignField: '_id',
                as: 'infocontents'
              }
            },*/

            { 
              $group:{
                _id: '$combinedC.flujo',
                //flujo:'$combinedC.flujo',
                contenidos: {$push: { contentId: '$combinedC.contentId',
                                      categoria:'$combinedC.categoria',
                                      identificador:'$combinedC.identificador',
                                      order:'$combinedC.order'
                                    }
                            }
              }
            },            
            {
              $project:{
                //conj:0,
                //nombreConjunto:1,
                //flujo:1,
                contenidos:1,
                _id:1
              }
            }/*,
            { 
              $sort: {'combinedC.order': 1 }
            }*/
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result);
        });
        
  });
})

// (ADMIN) GETS ALL THE NOTICES AND FLOWS OF ONE USER
router.get('/admin/getContents/:name', function (req, res) {
  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      Model.Content.aggregate(
           [
            { $match: {user:new mongoose.Types.ObjectId(userId._id)}},
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: { $eq: ['$kind', 'SingleContent' ] }, then: [{contentId:'$content',identificador:'$identificador',categoria:'$categoria'}] , else: [{siblingsId:'$siblings', identificador:'$identificador', categoria:'$categoria'}]  
                           }  
                        } 
                      }
              }
            },            
            { $unwind: '$contenidos'},
            {
              $project:{
                contenidos:1,
                //combinedC:1,
                _id:0
              }
            }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result);
        })    
  })
});

// GETS THE NOTICES OF ONE USER IN ORDER FILTERED BY FLOW
router.get('/contentsByOrder/:flow/:name', function (req, res) {

    Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Flow.aggregate([
            { $match: { nombreConjunto: req.params.flow, user:new mongoose.Types.ObjectId(userId._id) }},
            { $unwind: '$contents' },
            { $lookup: {
                from: 'contents',
                localField: 'contents._id',
                foreignField: '_id',
                as: 'conj'
              }
            },
            { $unwind: '$conj' },
            { $project: 
              {
                'user':1,
                'nombreConjunto':1,
                'contenidos':{
                  '_id':'$contents._id',
                  'order':'$contents.order',
                  'info':'$conj',
                  'data':'$contents.data'
                }
              } 
            },
            { $group: {
                _id: '$_id',
                cont: { $push: {
                    $cond: { if: { $eq: ['$contenidos.info.kind', 'SingleContent' ] }, then: {contentId:['$contenidos.info.content'],order:'$contenidos.order',data:'$contenidos.data'} , else: {contentId:'$contenidos.info.siblings',order:'$contenidos.order',data:'$contenidos.data'}  
                           } 
                        } 
                      }
              }
            }/*,
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$cont.contentId',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },
            { $unwind: '$combinedC'},
            { $lookup: {
                from: 'infocontents',
                localField: '$combinedC',
                foreignField: '_id',
                as: 'infoContents'
              }
            },/*,
            { 
              $group:{
                _id: '$combinedC',
                //flujo:'$combinedC.flujo',
                infocontents: 
                {$push: 
                  { url:'$infoContents.url',
                    xpath:'$infoContents.xpath',
                    data:'$cont.data'
                  }
                }
              }
            },
            {
              $project:{
                combinedC:1,
                infoContents:1,
                cont:1,
                _id:0
              }
            },
            { 
              $sort: {'cont.order': 1 }
            }*/
           ])
          .exec(function (err,result) {
              console.log("-Contents id %s ",result)
              res.status(200).send(result);
          });   
  });
})  
  
// GETS THE NOTICES OF ONE USER FILTERED BY CATEGORY
router.get('/contentsByCategory/:category/:name', function (req, res) {

  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Content.aggregate(
           [
            { $match: {user:new mongoose.Types.ObjectId(userId._id), categoria:req.params.category }},
            //{ $match: { '$contenidos.categoria':req.params.category }},
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: {$eq: ['$kind', 'SingleContent' ]}, then: ['$content'] , else: '$siblings'  
                           } 
                        } 
                      }
              }
            },
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$contenidos',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },
            { $unwind: '$combinedC'},
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC',
                foreignField: '_id',
                as: 'infocontents'
              }
            },
            {
              $project:{
                infocontents:1,
                //combinedC:1,
                _id:0
              }
            }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result);
        });
        
  });
});

//ADD A LIST OF SIBLING CONTENTS INTO THE COLLECTIONS CONTENT AND INFOCONTENT, WITHOUT ASSIGN A FLOW
router.post('/addSiblingContents/user/:name',function(req, res) {
      
      //req.body = {identificador:"",categoria:"",siblings:[{infoContent}]}
      var infoArray = req.body.siblings
      /* Controlar antes que si se repite la info, pueda crear un nuevo conjunto de hermanos, 
      sin agregar la info */ 

      Model.InfoContent.insertMany(infoArray
      ,function(err,contents){
          console.log("----Contents:",contents)
          if (err) return res.status(500).send("No se pudieron asignar los contents para el usuario");

          //const ids = contents.filter((elem,index) => { if(index < 2) return elem._id } ); 
          const ids = [];
          contents.forEach((cont) => ids.push(cont._id) );
          console.log("----ids:",ids)

          Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
            console.log(userId)
            
            //controlar que no se repitan los identificadores
            Model.Content.create(
                { kind: 'SiblingContent', user: userId,identificador: req.body.identificador , categoria:req.body.categoria, available:true, siblings: ids }
                ,function(err,contents){
                  console.log("--contents ",contents)
                  if (err) return res.status(500).send("No se pudieron asignar los contents para el usuario");
                  res.status(200).send(contents);
                })
          })
      })
});

//ADD A CONTENT INTO THE COLLECTIONS INFOCONTENT AND CONTENT OF A USER, WITHOUT ASSIGN A FLOW
router.post('/addContent/user/:name',function(req, res) {
      
      //req.body = {identificador:"",categoria:"",available:"",content:{}}
      var content = req.body.content
      //content.available:true
      //Controlar antes que no se repita la info 

      Model.InfoContent.create(content
      ,function(err,content){
          console.log("----Contents:",content)
          if (err) return res.status(500).send("No se pudo asignar el content para el usuario");

          const idContent = content._id;
          console.log("----id:",idContent)
          
          Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
            console.log(userId)
            //controlar que no se repita el identificador
            
            Model.Content.create(
                { kind: 'SingleContent', user: userId, identificador: req.body.identificador , categoria:req.body.categoria, available:true, content: idContent }
                ,function(err,contents){
                  console.log("--contents ",contents)
                  if (err) return res.status(500).send("No se pudo asignar el content para el usuario");
                  res.status(200).send(contents);
                })
          })
      })
});

//CREATE A FLOW FOR A USER WITH THE CONTENTS IN ORDER: UPDATE COLLECTION 'CONTENTS'
router.post('/createFlow/user/:name', function (req, res) {
          
          var contentsBody = req.body.contents.map((content)=>{
              //return content.identificador
              return content.identificador.charAt(0).toUpperCase() + content.identificador.slice(1)
          })
          
          //req.body = {nombreConjunto:"",contents:[ {identificador,idcontent,data:{}},"",""]}
          console.log(req.body.contents)
          Model.User.findOne({'name':req.params.name.toLowerCase()},'_id'
            ,function(err,userId){
              console.log(userId)
              //fijarse si cambiar find por aggregate
              Model.Content.find({ user:userId, identificador: { $in: contentsBody }, available:true}, '_id identificador',{lean:true}
              ,function(err,contents){
                  console.log("Stored contents ",contents) //idContents= ["",""]
                  if (err | contents.length == 0) return res.status(404).send("No se hallaron contents para ese usuario");
                  var idContents = [];
                  //var storedContents = []

                  contentsBody.forEach((iden,index)=>{
                    let indice = contents.findIndex(c => c.identificador == iden)
                    let cont = req.body.contents[indice]
                    if(indice != -1){
                      if(cont.data){
                        var data = {};
                        if(cont.data.metainfo) 
                          data.metainfo=cont.data.metainfo 
                        if(cont.data.read) 
                          data.read = cont.data.read
                        if(cont.data.next)
                          data.next = cont.data.next
                        //storedContents.push(contents[indice])
                        idContents.push( 
                        { 
                          _id:contents[indice]._id
                          , order:index
                          , data: data  
                        })
                      }else{
                        idContents.push( 
                        { 
                          _id:contents[indice]._id
                          , order:index 
                        })                              
                      }
                      console.log("id ",contents[indice]._id)
                      
                    }
                  })
                  console.log("ids- ",idContents);
                  //controlar que no se repita el nombreConjunto
                  Model.Flow.create({nombreConjunto:req.body.nombreConjunto,pattern:req.body.pattern, user:userId, contents:idContents}
                  ,function (err, flow) {      
                      console.log("----Flow: ",flow)
                      if (err) return res.status(500).send("No se pudo agregar el flow en la base");
                      
                      Model.User.findOneAndUpdate({_id:userId}, { $push: { flows: flow._id }} 
                      ,function (err,user) {                                  
                        console.log("----Usuario:",user)
                        if (err) return res.status(500).send("No se pudo modificar al usuario en la base");
                        res.status(200).send(flow);
                      })
                  })
              })
          })
});

//CHANGE THE ORDER OF THE CONTENTS OF A FLOW: UPDATE COLLECTION 'FLOWS'
router.put('/updateFlow/user/:name', function (req, res) {
      
      //req.body = {nombreConjunto:"",contents:[ identificador1,"",""]}
        Model.User.findOne({'name':req.params.name.toLowerCase()}, '_id', 
        function(err,userId){
          if (err | userId == "") return res.status(404).send("No se pudo hallar al usuario");
          
          Model.Content.find({ user:userId, identificador: { $in: req.body.contents }}, '_id identificador'
          ,function(err,contents){
              console.log(contents) //idContents= ["",""]
              if (err | contents.length == 0) return res.status(404).send("No se hallaron contents para ese usuario");
              var idContents = [];
              req.body.contents.forEach((cont,index)=>{
              let indice = contents.findIndex(c => c.identificador === cont)
              if(indice != -1) 
                idContents.push( { _id:contents[indice]._id, order:index } )
              })
              console.log(idContents);  
            
              Model.Flow.findOneAndUpdate({user:userId, nombreConjunto:req.body.nombreConjunto}, {contents:idContents}, function(e,flow){
                console.log(flow)
                if (err | flow == null) return res.status(404).send("No se pudo modificar el flujo");
                res.status(200).send(req.body);
              })
          })
        })
});

//---------------------------------------------------------------------

/*
router.get('/getFirstContent', function(req,response){
  
  fetch("https://alexa-nightmare.herokuapp.com/contents/getBodyContent?url="+req.query.url+"&path="+req.query.path)
    .then(res => {
        console.log("devuelve "+res.ok)
        if(res.ok)
          return res.json()
    }).then((body)=>{
        console.log(body)
        var result = JSON.stringify(body)
        response.status(200).send(result)
    })
})

router.get('/getFirstContent', async (req,response)=>{

  if(ready == true){
    ready = false
    response.status(200).send(contents[0]) 
  }
  else{
    response.status(504).send("The content is not ready yet")   
  }
})

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


/*
    Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Flow.aggregate(
           [
            { $match: { user:new mongoose.Types.ObjectId(userId._id) }},
            { $lookup: {
                from: 'contents',
                localField: 'contents',
                foreignField: '_id',
                as: 'contents'
              }
            },
            { $unwind: '$contents' },
            { $group: {
                _id: '$contents._id',
                contenidos: {$push: '$contents'}
              }
            },
            { $unwind: '$contenidos'},/*
            { $group: {
                _id: '$_id',
                cont: { $push: {
                    $cond: { if: { $eq: ['$contenidos.kind', 'SingleContent' ] }, then: [{contentId:'$contenidos.content',identificador:'$contenidos.identificador',categoria:'$contenidos.categoria'}] , else: [{siblingsId:'$contenidos.siblings', identificador:'$contenidos.identificador', categoria:'$contenidos.categoria'}]  
                           } 
                        } 
                      }
              }
            },
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$cont',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },/*
            {  $addFields:{
                'combinedC':{
                   $reduce: {
                      input: '$combined',
                      initialValue: [],
                      in: { $concatArrays : ["$$value", "$$this"] }
                   }
                 }
               }
            },
            { $unwind: '$combinedC'},
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC.',
                foreignField: '_id',
                as: 'infocontents'
              }
            },
            {
              $project:{
                _id:0
              }
            }
           ])
        .exec(function (err,result) {
            console.log("-Contents id %s ",result)
              res.status(200).send(result);
        });
        
  });*/


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


         /*.populate({ path: 'flows', 
                    select: 'contents -_id',
                    match: { nombreConjunto: { $eq: req.body.nombreConjunto }},
        })
        .exec(function(err,user){
          console.log('Id contents of a flow %s ',user,user.flows)    
            //flows será un [] de 
            if (err | user.flows[0].contents.length == 0) return res.status(404).send("No se hallaron flujos para ese usuario");
            res.status(200).send(user.flows[0].contents);
            //Model.Contents.find()

        })
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
            })*/


// GETS THE NOTICES OF ONE USER FILTER BY STATE(new/old)
router.get('/contentsByState/:state/:name', function (req, res) {

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
    Model.User.findOneAndRemove({"name":req.params.name.toLowerCase()}, function (err, user) { //{"userId":req.params.usrid,
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