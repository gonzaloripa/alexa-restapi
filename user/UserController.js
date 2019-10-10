// UserController.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();//Se usa para crear un subconjunto de rutas
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const Model = require('./Model');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
var content = null
var ready = false;


myEmitter.on('initEvent', () => {
  console.log('The first content is ready')
  ready = true
})

myEmitter.on('secondEvent', (content) => {
  console.log('The contents are ready',content)
  if(content != null)
    ready = true
})

//--------------------------  ROUTES -----------------------------------

router.post('/nextTitle/', function(req,response){
  response.status(200).send("Llego el aviso")
  var cont = req.body.contenidos //cont= [{url,xpath,_id},{}] 
  console.log("body ",cont)
  fetch("https://headless-chrome-alexa.herokuapp.com/getTitle?url="+cont.url+"&path="+cont.xpath)
      .then(res => {
          console.log("devuelve "+res.ok)
          if(res.ok)
            return res.json()
      })
      .then(json => {
          content = json
          console.log("content from nextTitle ",json)
          myEmitter.emit('secondEvent',json)       
      })
})


router.post('/nextRequest/', function(req,response){
  response.status(200).send("Llego el aviso")
  var cont = req.body.contenidos //cont= [{url,xpath,_id},{}]
  console.log("body ",cont, req.body)  
  fetch("https://headless-chrome-alexa.herokuapp.com/getBodyContent?url="+cont.url+"&path="+cont.xpath)
    .then(res => {
        console.log("devuelve "+res.ok)
        if(res.ok)
          return res.json()
    })
    .then(json => {
        content = json //json={contenido,host,title,intro}
        console.log("contents from nextRequest ",content)
        myEmitter.emit('secondEvent',json) 
  })
})

router.get('/getContents', function(req,response){
  console.log("/getContents",ready,content)
  if(ready == true){
    ready = false
    response.status(200).send(content) 
  }
  else{
    response.status(304).send("The contents are not ready")   
  }
})


//-------------- DB INTERACTION ---------------------------

// CREATES A NEW USER
router.post('/newUser', function (req, res) {
  	var name = req.body.name.toLowerCase(); 
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
    Model.User.find({ name:req.params.name.toLowerCase()}, function (err, user) {
      console.log(user)
        if (err || user.length == 0) return res.status(500).send("No se hallo ningún usuario con ese nombre");
        res.status(200).send({name:user[0].name});
    });
});

// GETS THE FLOWS OF A SINGLE USER FROM THE DATABASE
router.get('/flows/:name', function (req, res) { //'/:usrid/:name'
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .populate({ path: 'flows', select: 'nombreConjunto pattern -_id' })
    .exec(function(err,user){
      console.log('Flows %s ',user.flows)    
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
        if (err | userId == null) return res.status(404).send("No se hallaron flujos para ese usuario");
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
            },
            {
              $project:{
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
  //Devolver tmb la url de la coleccion infoContent
  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
      console.log(userId)
      Model.Content.aggregate(
           [
            { $match: {user:new mongoose.Types.ObjectId(userId._id), categoria:req.params.category }},
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: { $eq: ['$kind', 'SingleContent' ] }, then: [{contentId:['$content'],identificador:'$identificador',categoria:'$categoria',available:'$available'}] , else: [{contentId:'$siblings', identificador:'$identificador', categoria:'$categoria',available:'$available'}]  
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
                localField: 'combinedC.contentId.0',
                foreignField: '_id',
                as: 'dataContent'
              }
            },             
            { $unwind: '$dataContent'},
            {
              $project:{
                  contenidos: {
                    $mergeObjects: ["$combinedC", {url:"$dataContent.url"}]
                  },
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
  //Devolver tmb la url de la coleccion infoContent

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
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: { $eq: ['$kind', 'SingleContent' ] }, then: [{contentId:['$content'],identificador:'$identificador',categoria:'$categoria', available:'$available'}] , else: [{contentId:'$siblings', identificador:'$identificador', categoria:'$categoria', available:'$available'}]  
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
                localField: 'combinedC.contentId.0',
                foreignField: '_id',
                as: 'dataContent'
              }
            },
            { $unwind: '$dataContent'},
            {
              $project:{
                  contenidos: {
                    $mergeObjects: ["$combinedC", {url:"$dataContent.url"}]
                  },
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
            },
            { $group: {
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
            { $unwind: '$combinedC'},
            { 
              $group:{
                _id: '$combinedC.flujo',
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
                contenidos:1,
                _id:1
              }
            }
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
            { 
              $unwind: '$conj' 
            },            
            { 
              $match: { 'conj.available':true}
            },
            { 
              $project: 
              {
                'user':1,
                'nombreConjunto':1,
                'contenidos':{
                  '_id':'$contents._id',
                  'order':'$contents.order',
                  'info':'$conj',
                  'metadata':'$contents.metadata'
                }
              } 
            },
            { $group: {
                _id: '$_id',
                cont: { $push: {
                    $cond: { if: { $eq: ['$contenidos.info.kind', 'SingleContent' ] }, then: [{contentId:['$contenidos.info.content'],order:'$contenidos.order',metadata:'$contenidos.metadata',identificador:'$contenidos.info.identificador', navegable:'$contenidos.info.navegable'}] , else: [{contentId:'$contenidos.info.siblings',order:'$contenidos.order',metadata:'$contenidos.metadata',identificador:'$contenidos.info.identificador',navegable:'$contenidos.info.navegable'}]  
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
            {
              $unwind:'$combinedC'            
            },
            { $lookup: {
                from: 'infocontents',
                localField: 'combinedC.contentId',
                foreignField: '_id',
                as: 'dataContent'
              }
            },
            {
              $unwind:'$dataContent'
            },
            {
              $project:{
                dataContent:1,
                combinedC:1
              }
            }
            ,
            {
              $group:{
                _id:'$_id',
                content:{
                  $push:{
                    dataContent:{
                      info:'$dataContent',
                      metadata:'$combinedC.metadata',
                      navegable:'$combinedC.navegable'
                    }
                  }
                }
              }
            },
            {
              $unwind:'$content'
            },
            {
              $project:{
                content:1,
                _id:0
              }
            },
            { 
              $sort: {'combinedC.order': 1 }
            }
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
            { $match: {user:new mongoose.Types.ObjectId(userId._id), categoria:req.params.category, available:true }},
            { $group: {
                _id: '$_id',
                contenidos: { $push: {  
                    $cond: { if: { $eq: ['$kind', 'SingleContent' ] }, then: [{contentId:['$content'],metadata:'$metadata',identificador:'$identificador', navegable:'$navegable'}] , else: [{contentId:'$siblings',metadata:'$metadata',identificador:'$identificador',navegable:'$navegable'}]  
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
                localField: 'combinedC.contentId',
                foreignField: '_id',
                as: 'dataContent'
              }
            },
            {
              $unwind:'$dataContent'
            },
            {
              $project:{
                dataContent:1,
                combinedC:1
              }
            },
            {
              $group:{
                _id:'$_id',
                content:{
                  $push:{
                    dataContent:{
                      info:'$dataContent',
                      navegable:'$combinedC.navegable'
                    }
                  }
                }
              }
            },
            {
              $unwind:'$content'
            },
            {
              $project:{
                content:1,
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

//MAKE A CONTENT UNAVAILABLE (falta borrarlo del flow, no solo marcarlo como unavailable)
router.put('/setContentUnavailable/:name',function(req, res) {     
      var content = req.body.contenidos
      Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',
        function(err,userId){
            console.log(userId,content)

              Model.Content.findOneAndUpdate({ kind: 'SingleContent', user: userId, identificador: content.identificador, available:true}, 
              { $set: { available: false }},
              function(err,content){
                  console.log("--content ",content)
                  if (err) return res.status(500).send("No se pudo modificar el contenido");
                  res.status(200).send(content);
              })
      })
});

router.delete('/deleteContentUnavailable',function(req,res){
      console.log("Entra en deleteContentUnavailable")
      //var content = req.body.content
      var contentId = new mongoose.Types.ObjectId(req.query.id)
      Model.User.findOne({'name':req.query.name.toLowerCase()},'_id',
        function(err,userId){
            console.log(userId,contentId, req.query)
            Model.SingleContent.findOneAndDelete({user: userId, _id:contentId, available:false},
            function(err,cont){
                console.log("--content delete ", cont)

                Model.InfoContent.findByIdAndDelete(cont.content,
                function(err,info){
                    console.log("--info content delete ",info)

                    Model.Flow.findOneAndUpdate({ user:userId , contents: { $elemMatch: {_id: content.contentId} }}
                    ,{ $pull: {"contents": {_id:content.contentId } } },
                    function(err, result) {
                        console.log("Flow update - ",result)
                        if (err) return res.status(500).send("No se pudo eliminar el contenido");
                        if (result == null) return res.status(200).send("El contenido no figuraba en ningun flow")
                        res.status(200).send(result);
                    })
                })
            })
      })
})
            /*
                Model.Flow.update(
                  { "_id" :"1", "contents._id": content._id }, 
                  { "$set": { "contents.$": null }}, 
                  function(err, result) {
                    if (err) return res.status(500).send("No se pudo eliminar el contenido");
                    res.status(200).send(result);
                  })
            /*  
            Model.Content.findOneAndDelete({ kind: 'SingleContent', user: userId, identificador: content.identificador, available:false},
            function(err,content){
                console.log("--content ",content)
                if (err) return res.status(500).send("No se pudo eliminar el contenido");
                res.status(200).send(content);
            })*/


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
                { kind: 'SiblingContent', user: userId,identificador: req.body.identificador , categoria:req.body.categoria, available:true, navegable:req.body.navegable, siblings: ids }
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
      //req.body = {identificador:"",categoria:"",available,navegable,content:{}}
      var content = req.body.content
      console.log("AddContent - ",req.body, req.body.content)
      //Controlar antes que no se repita la info 

      Model.InfoContent.create(content
      ,function(err,content){
          console.log("----Contents:",content)
          if (err) return res.status(500).send("No se pudo asignar el content para el usuario")
          const idContent = content._id;
          console.log("----id:",idContent)

          Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
            console.log(userId)
            //controlar que no se repita el identificador      
            Model.Content.create(
                { kind: 'SingleContent', user: userId, identificador: req.body.identificador, categoria:req.body.categoria, available:true, navegable:req.body.navegable , content: idContent }
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
          console.log(req.body.contents)
          var contentsId = req.body.contents.map((content)=>{
              return content.name.charAt(0).toUpperCase() + content.name.slice(1).toLowerCase()
          })
          
          //req.body = {nombreConjunto:"",contents:[ {identificador,idcontent,data:{}},"",""]}
          
          Model.User.findOne({'name':req.params.name.toLowerCase()},'_id'
            ,function(err,userId){
              console.log(userId)
              //fijarse si cambiar find por aggregate
              Model.Content.find({ user:userId, identificador: { $in: contentsId }, available:true}, '_id identificador',{lean:true}
              ,function(err,contents){
                  console.log("Stored contents ",contents, contentsId) //idContents= ["",""]
                  if (err | contents.length == 0) return res.status(404).send("No se hallaron contents para ese usuario");
                  var idContents = [];
                  contentsId.forEach((id,index)=>{ //En el orden que que estan conectados
                    let indice = contents.findIndex(c => c.identificador === id)
                    let cont = req.body.contents[indice]
                    if(indice != -1){
                      if(cont.metadata){
                        var data = {};
                        if(cont.metadata.metaInfo) 
                          data.metaInfo=cont.metadata.metaInfo 
                        if(cont.metadata.pattern) 
                          data.pattern = cont.metadata.pattern
                        if(cont.metadata.next)
                          data.next = cont.metadata.next
                        idContents.push( 
                        { 
                          _id:contents[indice]._id
                          , order:index
                          , metadata: data  
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

module.exports = router;
