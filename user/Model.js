/* Model.js: modelos

Estrategias usadas: 
  -relaciones N:M (Flow-Content) usamos One Way embedding y (SetContent-Content) Two Way embedding
  -relaciones 1:N (User-Content) usamos Bucketing (hibrido entre Embedding y Linking)
  -relaciones 1:N (User-SetContent, User-Flow) usamos Linking
*/

const mongoose = require('mongoose');
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
             state:String,
             metainfo:String}]
})

const FlowSchema = new mongoose.Schema({
  idConjunto: {type:String,required: true},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true }
})

const SetContentSchema = new mongoose.Schema({
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

exports.User = User;
exports.SetContent = SetContent;
exports.Flow = Flow;
exports.Content = Content;

//module.exports = mongoose.model('User');
/*

  
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
