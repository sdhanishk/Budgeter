const expenses = require('./lib/expenses');
const accounts = require('./lib/accounts');
const paymenTypes = require('./lib/payment-types');
const income = require('./lib/income');
const categories = require('./lib/categories');

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
    handler: accounts.getAccounts
  }, {
    method: 'GET',
    url: '/accounts-ids-map',
    handler: accounts.getAccountsIdsMapAPI
  }, {
    method: 'GET',
    url: '/payment-types',
    handler: paymenTypes.getPaymentTypes
  }, {
    method: 'GET',
    url: '/payment-types-ids-map',
    handler: paymenTypes.getPaymentTypesIdsMapAPI
  }, {
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
  }, {
    method: 'GET',
    url: '/categories',
    handler: categories.getCategories
  }, {
    method: 'GET',
    url: '/categories-ids-map',
    handler: categories.getCategoriesIdsMapAPI
  }];

module.exports = routes;