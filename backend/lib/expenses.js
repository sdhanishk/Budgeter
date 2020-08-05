const moment = require('moment');

const database = require('../database/index');
const utils = require('../utils'); 
const paymentTypes = require('./payment-types');
const accounts = require('./accounts');

const MongoClient = database.MongoClient;
const url = database.url;

function computeTotals(_expense) {

  let expense = {..._expense}; 

  let sub_total = 0.00;

  const places = expense.places;
  for (let place of places) {

    let place_total = 0.00;

    const items = place.items;
    for (let item of items) {

      let item_total = 0.00;

      for (let itemCount = 1; itemCount <= item.quantity; itemCount++) {

        item_total += parseFloat(item.price_per_unit);

        item.total = item_total;

      }

      place_total += parseFloat(item_total);

      place.total = place_total;

    }

    sub_total += parseFloat(place_total);

    expense.total = sub_total;

  }

  return expense;

}

async function populateAccountDetails(_expenses) {

  const expenses = [..._expenses];

  const paymentTypesIdMap = await paymentTypes.getPaymentTypesIdMap();
  const accountsIdMap = await accounts.getAccountsIdMap();

  for (let expense of expenses) {

    for (let place of expense.places) {

      for (let item of place.items) {

          item.paid_with_account = accountsIdMap[item.paid_with_account].bank;
          item.payment_type = paymentTypesIdMap[item.payment_type].type;

      }

    }

  }

  return expenses;

}

async function getExpenses(request, response) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    budgeterDb.collection("expenses").find({}).toArray(async function(err, result){
      if (err) throw err;
      const expenses = await populateAccountDetails(result);
      response.send(expenses);
    });
  });
}

async function addExpense(request, response) {

  const time = await utils.getCurrentTime();
  let datetime = request.body.datetime;

  if(typeof datetime === 'undefined'){
    datetime = moment(time).toDate().getTime();
  }

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const budgeterDb = db.db('budgeter');
    const expense = {
      datetime,
      ...computeTotals(request.body)
    }
    budgeterDb.collection("expenses").insert(expense, function(err, data){
      if (err) throw err;
      response.send(data.ops[0]);
    });
  });

}

module.exports = {
  getExpenses,
  addExpense,
};