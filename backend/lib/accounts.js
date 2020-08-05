const database = require('../database/index');
const mongodb = require('mongodb');
const MongoClient = database.MongoClient;
const url = database.url;

async function getAccounts(request, response) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    budgeterDb.collection("accounts").find({}).toArray(function(err, data){
      if (err) throw err;
      response.send(data);
    });
  });

}

async function getAccountSummaryByAccountId(id) {

  const accountSummaryPromise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) reject(err);
      const budgeterDb = db.db('budgeter');
      budgeterDb.collection("accounts_summary").find({_id: mongodb.ObjectID(id)}).toArray(function(err, data){
        if (err) reject(err);
        resove(data);
      });
    });
  });

  return await accountSummaryPromise;

}

async function getAccountsIdsMapAPI(request, response) {

  const accountsIdsMap = await getAccountsIdMap();

  response.send(accountsIdsMap);

}

async function getAccountsIdMap() {

  const accountsPromise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) reject(err);
      const budgeterDb = db.db('budgeter');
      budgeterDb.collection("accounts").find({}).toArray(function(err, data){
        if (err) reject(err);
        resolve(data);
      });
    })
  });

  const accounts = await accountsPromise;

  const accountsIdMap = {};

  for (let paymentType of accounts){
    accountsIdMap[paymentType._id] = paymentType;
  }

  return accountsIdMap;

}

module.exports = {
  getAccounts,
  getAccountsIdMap,
  getAccountsIdsMapAPI
};