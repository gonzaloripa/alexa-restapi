// db.js:conectamos la base con el servidor
var dynamoose = require('dynamoose');
//dynamoose.local();
dynamoose.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'

});

console.log("--------Clave",process.env.AWS_ACCESS_KEY_ID)
/*var AWS = require('aws-sdk');
var config = {
  "apiVersion": "2012-08-10",
  "region":"us-west-2",
  "endpoint": "http://localhost:8000"
}
var dynamodb = new AWS.DynamoDB(config);*/