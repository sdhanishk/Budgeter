const moment = require('moment');

const database = require('../database/index');
const utils = require('../utils'); 
const accounts = require('./accounts');

const MongoClient = database.MongoClient;
const url = database.url;

function computeTotals(_income) {

  let income = {..._income}; 

  let total = 0.00;
  for (let source of income.sources) {
    
    total += parseFloat(source.amount);

  }

  income.total = total;

  return income;

}

async function populateAccountDetails(_incomes) {

  const incomes = [..._incomes];

  const accountsIdMap = await accounts.getAccountsIdMap();

  for (let income of incomes) {

    for (let source of income.sources) {

          source.account = accountsIdMap[source.account].bank;

    }

  }

  return incomes;

}

async function getIncomes(request, response) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    budgeterDb.collection("incomes").find({}).toArray(async function(err, result){
      if (err) throw err;
      const incomes = await populateAccountDetails(result);
      response.send(incomes);
    });
  });
}

async function addIncome(request, response) {

  const time = await utils.getCurrentTime();

  let datetime = request.body.datetime;

  if(typeof datetime === 'undefined'){
    datetime = moment(time).toDate().getTime();
  }

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    const income = {
      datetime,
      ...computeTotals(request.body)
    }
    budgeterDb.collection("incomes").insert(income, function(err, data){
      if (err) throw err;
      response.send(data.ops[0]);
    });
  });

}

async function addCarryOverAmount(request, response) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    budgeterDb.collection("carry_overs").insert({...request.body}, function(err, data){
      if (err) throw err;
      response.send(data.ops[0]);
    });
  });

}

async function getCarryOverByMonth(request, response) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    console.log(request.query.for_month);
    budgeterDb.collection("carry_overs").findOne({for_month: parseInt(request.query.for_month)}, function(err, result){
      if (err) throw err;
      response.send(result);
    });
  });

}

module.exports = {
  getIncomes,
  addIncome,
  addCarryOverAmount,
  getCarryOverByMonth
};