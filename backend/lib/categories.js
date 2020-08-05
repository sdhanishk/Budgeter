const database = require('../database/index');
const mongodb = require('mongodb');
const MongoClient = database.MongoClient;
const url = database.url;

async function getCategories(request, response) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    budgeterDb.collection("categories").find({}).toArray(function(err, data){
      if (err) throw err;
      response.send(data);
    });
  });

}

async function getCategoriesIdsMapAPI(request, response) {

  const categoriesIdsMap = await getCategoriesIdMap();

  response.send(categoriesIdsMap);

}

async function getCategoriesIdMap() {

  const categoriesPromise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) reject(err);
      const budgeterDb = db.db('budgeter');
      budgeterDb.collection("categories").find({}).toArray(function(err, data){
        if (err) reject(err);
        resolve(data);
      });
    })
  });

  const categories = await categoriesPromise;

  const categoriesIdMap = {};

  for (let category of categories){
    categoriesIdMap[category._id] = category;
  }

  return categoriesIdMap;

}

module.exports = {
  getCategories,
  getCategoriesIdMap,
  getCategoriesIdsMapAPI
};