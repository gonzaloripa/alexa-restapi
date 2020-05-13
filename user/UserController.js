// Api Restful

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
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
var waiting = true


myEmitter.on('initEvent', (content) => {
  console.log('The content is ready ', content)
  ready = true
})

myEmitter.on('secondEvent', () => {
  console.log('The content fails')
  ready = false
  waiting = false
})

//--------------------------  GENERAL ROUTES -----------------------------------

router.post('/nextTitle/', function(req,response){
  response.status(200).send("Llego el aviso")
  var cont = req.body.contenidos

  fetch("https://headless-chrome-alexa.herokuapp.com/getTitle?url="+cont.url+"&path="+cont.xpath)
      .then(res => {
          return res.json()
      })
      .then(json => {
          content = json
          myEmitter.emit('initEvent',json)       
      })
      .catch(e => {
        console.log(e)
        myEmitter.emit('secondEvent')
    }) 
})


router.post('/nextRequest/', function(req,response){
  response.status(200).send("Llego el aviso")
  var cont = req.body.contenidos 

  fetch("https://headless-chrome-alexa.herokuapp.com/getBodyContent?url="+cont.url+"&path="+cont.xpath)
    .then(res => {
        return res.json()
    })
    .then(json => {
        content = json //json = { contenido, host, title, intro }
        myEmitter.emit('initEvent',json)
    })
    .catch(e => {
      console.log(e)
      myEmitter.emit('secondEvent')
    }) 
})

router.get('/getContents', function(req,response){

  if(ready == true){
    ready = false
    waiting = true
    response.status(200).send(content) 
  }
  else{
    if (waiting == true)
      response.status(304).send("The contents are not ready yet")
    else{
      waiting = true
      response.status(504).send("The contents weren't obtained")
    }
  }
})


router.get('/closeSession', function(req,res){
  req.session.username = ""
  res.status(200).send("The session was closed");

})

router.get('/getSessionName', function(req,res){
  try{
    var username = (req.session.username != "") ? req.session.username : ""
    res.status(200).send(username)
  }
  catch(e){
    res.status(200).send("")
  }
})

//-------------- DB INTERACTION --------------------------------------------

// Se da de alta un nuevo usuario
router.post('/newUser', function (req, res) {
  	var name = req.body.name.toLowerCase(); 
    req.session.username = name    
    var userId = new mongoose.Types.ObjectId;

    Model.User.create({name: name, _id:userId, flows: [] }
    ,function (err, user) {      
        if (err) return res.status(500).send("No se pudo agregar al usuario en la base");
        res.status(200).send(user);
    })
});


// Devuelve todos los usuarios
router.get('/', function (req, res) {
    Model.User.find({}, function (err, users) {
        if (err) return res.status(404).send("No se hallaron usuarios");
        res.status(200).send(users);
    });
});

// Devuelve un usuario filtrado por nombre
router.get('/getUser/:name', function (req, res) {
    req.session.username = req.params.name.toLowerCase()
    
    Model.User.find({ name:req.session.username}, function (err, user) {
      console.log(user)
        if (err || user.length == 0) return res.status(500).send("No se hallo ningún usuario con ese nombre");
        res.status(200).send({name:user[0].name});
    });
});

// Obtiene los grupos de contenidos dado un nombre de usuario
router.get('/flows/:name', function (req, res) { 
    Model.User.findOne({'name':req.params.name.toLowerCase()})
    .populate({ path: 'flows', select: 'nombreConjunto pattern -_id' })
    .exec(function(err,user){
        if (err | user.flows.length == 0) return res.status(404).send("No se hallaron flujos para ese usuario");
        res.status(200).send(user.flows);
      });
});

// Obtiene la primer categoría definida por el usuario que está dentro de la sesión
router.get('/getFirstCategory/', function (req, res) { 
    var username = req.session.username

    Model.User.findOne({'name':username.toLowerCase()})
    .select('_id')
    .exec(function(err,userId){
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

// Obtiene las categorías definidas por el usuario que está dentro de la sesión
router.get('/categories', function (req, res) { 
    var username = req.session.username

    Model.User.findOne({'name':username.toLowerCase()})
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

//--------- CONTENT ADMIN --------------

// (ADMIN) Obtiene los contenidos de un usuario en orden filtrado por nombre de grupo de contenido
router.get('/admin/contentsByOrder/:flow', function (req, res) {

    var username = (req.session.username != "") ? req.session.username : ""

    Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
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
        res.status(200).send(result[0].combinedC);
      })    
  })
});  

// (ADMIN) Obtiene los contenidos de un usuario filtrado por categoria
router.get('/admin/contentsByCategory/:category', function (req, res) {  
  var username = (req.session.username != "") ? req.session.username : ""

  Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
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
        res.status(200).send(result);
     })     
  })
});

// (ADMIN) Obtiene los contenidos del usuario que inició sesión de la primer categoría definida
router.get('/admin/contentsByFirstCategory', function (req, res) {
  var username = (req.session.username != "") ? req.session.username : ""

  Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
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

// (ADMIN) Obtiene todos los contenidos y grupos de contenidos del usuario que inició sesión
router.get('/admin/contentsAndFlows', function (req, res) {
  var username = (req.session.username != "") ? req.session.username : ""

  Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
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
          contenidos: {
            $push: { 
              contentId: '$combinedC.contentId',
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
        res.status(200).send(result);
     })     
  })
});

// (ADMIN) Obtiene todos los contenidos del usuario que inició sesión
router.get('/admin/getContents', function (req, res) {  
  var username = (req.session.username != "") ? req.session.username : ""

  Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
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
        res.status(200).send(result);
      })    
  })
});

//-------- CONTENT PARSER ------------

// Obtiene los contenidos de un usuario en orden filtrado por nombre de grupo de contenidos
router.get('/contentsByOrder/:flow/:name', function (req, res) {
    var username = req.params.name
    Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
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
        res.status(200).send(result);
      })   
  })
});  
  
// Obtiene los contenidos de un usuario filtrado por el nombre y la categoría
router.get('/contentsByCategory/:category/:name', function (req, res) {

  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',function(err,userId){
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
        res.status(200).send(result);
      })  
  })
});

//Marca un contenido como no disponible desde el skill
router.put('/setContentUnavailable/:name',function(req, res) {     
  var content = req.body.contenido
  
  Model.User.findOne({'name':req.params.name.toLowerCase()},'_id',
    function(err,userId){
      Model.Content.findOneAndUpdate({ kind: 'SingleContent', user: userId, content: content._id, available:true}, 
      { $set: { available: false }},
      function(err,content){
        if (err) return res.status(500).send("No se pudo modificar el contenido");
        res.status(200).send(content);
      })
  })
});

//Borra de la base un contenido que ya no está disponible
router.delete('/deleteContentUnavailable',function(req,res){
  var contentId = new mongoose.Types.ObjectId(req.query.id)
  var username = (req.session.username != "") ? req.session.username : ""
  
  Model.User.findOne({'name':username.toLowerCase()},'_id',
    function(err,userId){
      Model.SingleContent.findOneAndDelete({user: userId, _id:contentId, available:false},
      function(err,cont){
        Model.InfoContent.findByIdAndDelete(cont.content,
        function(err,info){
          Model.Flow.findOneAndUpdate({ user:userId , contents: { $elemMatch: {_id: content.contentId} }}
          ,{ $pull: {"contents": {_id:content.contentId } } },
          function(err, result) {
            if (err) return res.status(500).send("No se pudo eliminar el contenido");
            if (result == null) return res.status(200).send("El contenido no figuraba en ningun flow")
            res.status(200).send(result);
          })
        })
      })
  })
})
          
//Agrega una lista de contenidos hermanos a las colecciones 'content' e 'infocontent' sin asignarle un grupo
router.post('/addSiblingContents',function(req, res) {
  var infoArray = req.body.siblings
  var username = req.session.username

  Model.InfoContent.insertMany( infoArray, function(err,contents){
    if (err) return res.status(500).send("No se pudieron asignar los contents para el usuario");
    const ids = [];
    contents.forEach((cont) => ids.push(cont._id) );

    Model.User.findOne({'name':username.toLowerCase()},'_id', function(err,userId){
      Model.Content.create(
        { kind: 'SiblingContent', user: userId,identificador: req.body.identificador , categoria:req.body.categoria, available:true, navegable:req.body.navegable, siblings: ids }
        , function(err,contents){
          if (err) return res.status(500).send("No se pudieron asignar los contents para el usuario");
          res.status(200).send(contents);
        })
    })
  })
});

//Agrega un contenido a las colecciones 'content' e 'infocontent' sin asignarle un grupo
router.post('/addContent',function(req, res) {      
  var content = req.body.content
  var username = req.session.username

  Model.InfoContent.create(content, function(err,content){
    if (err) return res.status(500).send("No se pudo asignar el content para el usuario")
    const idContent = content._id;

    Model.User.findOne({'name':username.toLowerCase()},'_id',function(err,userId){
      Model.Content.create(
        { kind: 'SingleContent', user: userId, identificador: req.body.identificador, categoria:req.body.categoria, available:true, navegable:req.body.navegable , content: idContent }
        , function(err,contents){
          if (err) return res.status(500).send("No se pudo asignar el content para el usuario");
          res.status(200).send(contents);
        })
    })
  })
});

//Crea un grupo con contenidos en orden (se actualiza la coleccion 'contents')
router.post('/createFlow', function (req, res) {
    console.log(req.body.contents)
    var contentsId = req.body.contents.map((content)=>{
        return content.name.charAt(0).toUpperCase() + content.name.slice(1).toLowerCase()
    })
    var username = req.session.username
    
    Model.User.findOne({'name':username.toLowerCase()}, '_id', function(err,userId){
      Model.Content.find({ user:userId, identificador: { $in: contentsId }, available:true}, '_id identificador',{lean:true}
      , function(err,contents){
        if (err | contents.length == 0) return res.status(404).send("No se hallaron contents para ese usuario");
        var idContents = [];
        contentsId.forEach((id,index)=>{ //En el orden que estan conectados
          let indice = contents.findIndex(c => c.identificador === id)
          let cont = req.body.contents[index]
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
          }
        }); //Fin del forEach

        Model.Flow.create({nombreConjunto:req.body.nombreConjunto, pattern:req.body.pattern, user:userId, contents:idContents}
        ,function (err, flow) {      
          if (err) return res.status(500).send("No se pudo agregar el flow en la base");
          
          Model.User.findOneAndUpdate({_id:userId}, { $push: { flows: flow._id }} 
          ,function (err,user) {                                  
            if (err) return res.status(500).send("No se pudo modificar al usuario en la base");
            res.status(200).send(flow);
          })
        })
      })
    })
});

//Cambia el orden de los contenidos dentro de un grupo de contenidos (actualiza la coleccion 'flows')
router.put('/updateFlow', function (req, res) {
    var username = req.session.username

    Model.User.findOne({'name':username.toLowerCase()}, '_id', function(err,userId){
      if (err | userId == "") return res.status(404).send("No se pudo hallar al usuario");
      
      Model.Content.find({ user:userId, identificador: { $in: req.body.contents }}, '_id identificador'
      , function(err,contents){
        if (err | contents.length == 0) return res.status(404).send("No se hallaron contents para ese usuario");
        var idContents = [];
        req.body.contents.forEach((cont,index)=>{
        let indice = contents.findIndex(c => c.identificador === cont)
        if(indice != -1) 
          idContents.push( { _id:contents[indice]._id, order:index } )
        })
      
        Model.Flow.findOneAndUpdate({user:userId, nombreConjunto:req.body.nombreConjunto}, {contents:idContents}, function(e,flow){
          if (err | flow == null) return res.status(404).send("No se pudo modificar el flujo");
          res.status(200).send(req.body);
        })
      })
    })
});

module.exports = router;
