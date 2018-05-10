// db.js:conectamos la base con el servidor
var dynamoose = require('dynamoose');
dynamoose.local();
dynamoose.AWS.config.update({
  accessKeyId: 'AKIAI3NDSBREHM57OXBQ',
  secretAccessKey: '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',
  region: 'us-east-1'

});

/*var AWS = require('aws-sdk');
var config = {
  "apiVersion": "2012-08-10",
  "accessKeyId": "abcde",
  "secretAccessKey": "abcde",
  "region":"us-west-2",
  "endpoint": "http://localhost:8000"
}
var dynamodb = new AWS.DynamoDB(config);*/