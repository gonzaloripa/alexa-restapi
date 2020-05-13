// Modelo de la base de datos
const mongoose = require('mongoose'); 

var InfoContentSchema = new mongoose.Schema({
    url: {type:String,required: true},
    xpath: {type:String, required:true}
  });

var InfoContent = mongoose.model('InfoContent', InfoContentSchema);

var contentSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  identificador: {type: String, required:true, unique:true},    
  categoria: String,
  available: Boolean,
  navegable: Boolean
}, {discriminatorKey: 'kind'});

var Content = mongoose.model('Content', contentSchema);

var flowSchema = new mongoose.Schema(
  { 
    user: { 
      type: mongoose.Schema.Types.ObjectId, ref:'User'}, 
      nombreConjunto: { type:String,required:true, unique:true}, 
      pattern:{ type:String,required:true},
      contents:  
      [
        { 
          id: { type: mongoose.Schema.Types.ObjectId, ref:'Content'}, 
          order:Number,
          metadata:{
            metaInfo: String,
            pattern: String,
            next: String
          } 
        }
      ] //El array 'contents' puede contener dos tipos diferentes de 'Content': 'singleContent' y 'siblingContent'
  }); 


var SingleContent = Content.discriminator('SingleContent',new mongoose.Schema({
  content: { type: mongoose.Schema.Types.ObjectId, ref:'InfoContent'}
}, { _id: false }));

var SiblingContent = Content.discriminator('SiblingContent', new mongoose.Schema({
  siblings: [{ type: mongoose.Schema.Types.ObjectId, ref:'SingleContent'}]
}, { _id: false }));

var Flow = mongoose.model('Flow', flowSchema);

const UserSchema = new mongoose.Schema({  
  name: { type:String,required: true, unique:true},
  password: String,
  flows: [{ type: mongoose.Schema.Types.ObjectId, ref:'Flow'}]
});

const User = mongoose.model('User', UserSchema);

exports.User = User;
exports.Flow = Flow;
exports.InfoContent = InfoContent;
exports.Content = Content;
exports.SingleContent = SingleContent;


