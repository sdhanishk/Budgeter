const database = require('../database/index');

const MongoClient = database.MongoClient;
const url = database.url;

async function getPaymentTypes(request, response) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    budgeterDb.collection("payment_types").find({}).toArray(function(err, data){
      if (err) throw err;
      response.send(data);
    });
  });

}

async function getPaymentTypesIdMap(request, response) {

  const paymentTypesPromise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) reject(err);
      const budgeterDb = db.db('budgeter');
      budgeterDb.collection("payment_types").find({}).toArray(function(err, data){
        if (err) reject(err);
        resolve(data);
      });
    })
  });

  const paymentTypes = await paymentTypesPromise;

  const paymentTypesIdMap = {};

  for (let paymentType of paymentTypes){
    paymentTypesIdMap[paymentType._id] = paymentType;
  }

  return paymentTypesIdMap;

}

async function getPaymentTypesIdsMapAPI(request, response) {

  const paymentTypesIdsMap = await getPaymentTypesIdMap();

  response.send(paymentTypesIdsMap);

}

module.exports = {
  getPaymentTypes,
  getPaymentTypesIdMap,
  getPaymentTypesIdsMapAPI
};