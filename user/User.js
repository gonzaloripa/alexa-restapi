// User.js: modelo del usuario
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({  
  //userId: {type:String},
  name: {$type:String},
  password:{$type:String},
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
});

var Usuario = mongoose.model('User', UserSchema);
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
        },{
        idContent:'marca',
        contents:[{
          url:'diariomarca',
          xpath:'unxpath2',
          state:'new'
        }
        ]
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

console.log(gonza.name,gonza.flujos[0].contenidos[0].contents[0].url)

module.exports = mongoose.model('User');
/*
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
