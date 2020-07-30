const expenses = require('./lib/expenses');
const accunts = require('./lib/accounts');
const paymenTypes = require('./lib/payment-types');
const income = require('./lib/income');

const routes = [{
    method: 'GET',
    url: '/expenses',
    handler: expenses.getExpenses
  }, {
    method: 'POST',
    url: '/add-expense',
    handler: expenses.addExpense
  }, {
    method: 'GET',
    url: '/accounts',
    handler: accunts.getAccounts
  }, {
    method: 'GET',
    url: '/payment-types',
    handler: paymenTypes.getPaymentTypes
  },{
    method: 'GET',
    url: '/incomes',
    handler: income.getIncomes
  }, {
    method: 'POST',
    url: '/add-income',
    handler: income.addIncome
  }, {
    method: 'POST',
    url: '/add-carry-over-amount',
    handler: income.addCarryOverAmount
  },{
    method: 'GET',
    url: '/carry-over',
    handler: income.getCarryOverByMonth
  }];

module.exports = routes;