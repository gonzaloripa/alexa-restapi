/* Model.js: modelos

Estrategias usadas: 
  -relaciones N:M (Flow-Content) usamos One Way embedding y (SetContent-Content) Two Way embedding
  -relaciones 1:N (User-Content) usamos Bucketing (hibrido entre Embedding y Linking)
  -relaciones 1:N (User-SetContent, User-Flow) usamos Linking

formas de enviar la info al front:
[{c1},{c2},{c3}, [{c4},{c5},{c6}] ]

newyork,lanacion, { hermanos-cielosports, [idCont,idCont]}
newyork, { hermanos-cielosports, conjunto:true}, lanacion


Crear jerarquia de esquemas:
        Cont
         _id
Cont ind <-- Conjunto
identif      identif
             [_id]

Flujo
[Cont_id]
*/

const mongoose = require('mongoose'); 
var InfoContentSchema = new mongoose.Schema({
    url: {type:String,required: true},
    xpath: {type:String,lowercase: true, required:true}
  });

var InfoContent = mongoose.model('InfoContent', InfoContentSchema);

var contentSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  identificador: {type: String, required:true, unique:true},    
  categoria: String,
  available: Boolean,
  navegable: Boolean
},{discriminatorKey: 'kind'});

var Content = mongoose.model('Content', contentSchema);


var flowSchema = new mongoose.Schema({ user: {type: mongoose.Schema.Types.ObjectId, ref:'User'}, 
                                      nombreConjunto: { type:String,required:true, unique:true}, //nombreFlujo
                                      pattern:{ type:String,required:true},
                                      contents: 
                                      [
                                        { id:{type: mongoose.Schema.Types.ObjectId, ref:'Content'}, 
                                          order:Number,
                                          data:{
                                            metainfo: String,
                                            read: String,
                                            next: String
                                          } 
                                        }
                                      ]}); //contents: [contentSchema]
// flowSchema.path('contents')` gets the mongoose `DocumentArray`
//var docArray = flowSchema.path('contents');

// The `contents` array can contain 2 different types of content: singleContent and siblingContent
var SingleContent = Content.discriminator('SingleContent', new mongoose.Schema({
  content: { type: mongoose.Schema.Types.ObjectId, ref:'InfoContent'}
}, { _id: false }));

var SiblingContent = Content.discriminator('SiblingContent', new mongoose.Schema({
  siblings: [{ type: mongoose.Schema.Types.ObjectId, ref:'SingleContent'}]
}, { _id: false }));

var Flow = mongoose.model('Flow', flowSchema);

const UserSchema = new mongoose.Schema({  
  //userId: {type:String},
  name: {type:String,required: true, unique:true},
  password: String,
  flows: [{ type: mongoose.Schema.Types.ObjectId, ref:'Flow'}]
});

const User = mongoose.model('User', UserSchema);

exports.User = User;
exports.Flow = Flow;
exports.InfoContent = InfoContent;
exports.Content = Content;

//module.exports = mongoose.model('User');
/*


var options = { discriminatorKey: 'kind', _id:false };

var ContentSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId}
  },
  { discriminatorKey: 'kind' });

var Content = mongoose.model('Content', ContentSchema);


const SingleContentSchema = new mongoose.Schema({

},options);

var SingleContent = Content.discriminator('SingleContent',
SingleContentSchema);


const SiblingContentSchema = new mongoose.Schema({
  siblings: [{type: mongoose.Schema.Types.ObjectId, ref:'SingleContent'}]
},options);

var SiblingContent = Content.discriminator('SiblingContent',
SiblingContentSchema);





const ContentSchema = new mongoose.Schema({

  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  page: Number,
  count: { type: Number, max: 200 }, //Ajustar max en base a lo que ocupe cada documento (tamaño max. permitido 16mb)  
  contents:[{
             idContent:String, 
             setContent_id: {type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SetContent'}] ,default: undefined }, //max=2  
             flow_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flow', required: false }],
             url:{type:String,required: true},
             xpath:{type:String,lowercase: true, required:true},
             category:String,
             metainfo:String}]
})

const FlowSchema = new mongoose.Schema({
  [idC] = [1,[1,2,3],2,3]

  idConjunto: {type:String,required: true},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true }
})

const SetContentSchema = new mongoose.Schema({ //Ver si meter una coleccion de contents hermanos en este esquema
   contents:[{
             idContent:String, 
             setContent_id: {type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SetContent'}] ,default: undefined }, //max=2  
             flow_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flow', required: false }],
             url:{type:String,required: true},
             xpath:{type:String,lowercase: true, required:true},
             category:String,
             state:String,
             metainfo:String}]
  idContent: {type:String,required: true}, //Agrupamiento de contenidos hermanos
  content_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }], 
  flow_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flow' }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

})

const UserSchema = new mongoose.Schema({  
  //userId: {type:String},
  name: {type:String,required: true},
  password: String
});

const User = mongoose.model('User', UserSchema);
const SetContent = mongoose.model('SetContent', SetContentSchema);
const Flow = mongoose.model('Flow', FlowSchema);
const Content = mongoose.model('Content', ContentSchema);


//console.log(gonza.name,set.user_id,content.flow_id.idConjunto,content2.setContent_id.idContent)




  
user_id = mongoose.Types.ObjectId()
flow_id = mongoose.Types.ObjectId()
setC_id = mongoose.Types.ObjectId()
content_id = mongoose.Types.ObjectId()

var gonza = new User ({ name: 'gonza', _id: user_id })
 
var set = new SetContent ({
  _id:setC_id, 
  idContent:'portada',
  flow_id: flow_id,
  user_id: user_id 
})

var flow = new Flow ({
  _id:flow_id,   
  idConjunto:'primero',
  user_id: user_id 
})

var content = new Content ({ 
  url:'bbc.news',
  xpath:'unxpath',
  state:'new',
  user_id: user_id,
  flow_id: flow_id 
})

var content2 = new Content ({ 
  url:'elpais.com',
  xpath:'unxpath3',
  state:'edited',
  user_id: user_id,
  setContent_id: setC_id,
  flow_id: flow_id 
})


    UserSchema.virtual('flows', {
      ref: 'Flow', // The model to use
      localField: '_id', // Find people where `localField`
      foreignField: 'user_id', // is equal to `foreignField`
      // If `justOne` is true, 'members' will be a single doc as opposed to
      // an array. `justOne` is false by default.
      justOne: false
      //options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
    });

db.places.insert({
    "_id": original_id,
    "name": "Broadway Center",
    "url": "bc.example.net"
})

db.people.insert({
    "name": "Erin",
    "places_id": original_id,
    "url":  "bc.example.net/Erin"
})



  flujos:[{
          idConjunto:String,
          contenidos:[{
            idContent:String,
            contents:[{
              url:String,
              xpath:{type:String,lowercase: true},
              category:String,
              state:String,
              metainfo:String
            }]
          }]
        }]

var gonza = new Usuario ({
    name: 'gonza',
    flujos:[{
      idConjunto: 'primero',
      contenidos:[{
        idContent:'bbc',
        contents:[{
          url:'bbc.news',
          xpath:'unxpath',
          state:'new'
        }]
        },{
        idContent:'marca',
        contents:[{
          url:'diariomarca',
          xpath:'unxpath2',
          state:'new'
        }]
        }
      ]
    },{
      idConjunto: 'segundo',
      contenidos:[{
        idContent:'elpais',
        contents:[{
          url:'elpais.com',
          xpath:'unxpath3',
          state:'edited'
        }]
        },{
        idContent:'ole',
        contents:[{
          url:'ole.com.ar',
          xpath:'unxpath4',
          state:'edited'
        }
        ]
      }
      ]
    }]
  });

var userSchema = new dynamoose.Schema({
  userid: {
    type: String,
    hashKey: true
  },
  name: {
    type: String,
    rangeKey: true,
    index: true // name: nameLocalIndex, ProjectionType: ALL
  },
  noticias:[{url:String,xpath:String,category:String}]
  },
  {
  useDocumentTypes: true,
  saveUnknown: true,
  }
);

var User = dynamoose.model('Usr', userSchema); //{ userid: String, name: String,noticias:[{url:String,xpath:String,category:String}]},{


module.exports = User;
/*
// This will create a Dynamoose model "Cat" (which is basically like a DynamoDB table), it will allow for 2 properties in the schema, `id` (number) and `name` (string)
var Cat = dynamoose.model('Cat', { id: Number, name: String });

// This will create a new instance of our "Cat" model, with the `id` as 666, and `name` as 'Garfield'
var garfield = new Cat({id: 666, name: 'Garfield'});

// This will save our new object to DynamoDB (remember this happens asynchronously, so you need to be sure to wait before trying to access the object)
garfield.save();

// This will preform an DynamoDB get on the "Cat" model/table get the object with the `id` = 666 and return a promise with the returned object.
Cat.get(666)
.then(function (badCat) {
  console.log('Never trust a smiling cat. - ' + badCat.name);
});

var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String
});
mongoose.model('User', UserSchema);
*/
