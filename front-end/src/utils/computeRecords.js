const moment = require('moment');

export function getFormattedDataFromTimeStamp(timestamp, format){
  
  return moment(timestamp).format(format);

}

const Map = {
  EXPENSE: 'EXPENSE',
  INCOME: 'INCOME'
};

export function computeRecords(data) {

  const { expenses, incomes } = data;

  function extractRecordsFromIncomes(incomes) {

    const records = [];

    for(let income of incomes) {
  
      let datetime = income.datetime;
        
      for (let source of income.sources) {
  
        let incomeData = {
          datetime,
          ...source,
          type: Map.INCOME,
          total: source.amount
        };

        if(incomeData.description !== ''){
          delete(income.description);
        }

        records.push(incomeData);
  
      }
  
    }

    return records;

  }
  
  function extractRecordsFromExpenses(expenses) {
  
    const records = [];
  
    for(let expense of expenses) {
  
      let datetime = expense.datetime;
      
      for (let place of expense.places) {
  
        let expenseData = {};
  
        expenseData.type = Map.EXPENSE;
        expenseData.shopName = place.name;
        expenseData.datetime = datetime;

        if(place.description !== ''){
          expense.description = place.description;
        }

        expenseData.items = place.items;
        expenseData.amount = place.total;

        records.push(expenseData);
  
      }
  
    }

    return records;
  
  }

  function segregeteToMonthlyRecords(records) {

    const monthlyRecords = {};
    const months = [];

    for(let record of records) {

      let firstDayOfMonth = moment(record.datetime).startOf('month').toDate().getTime();

      if(months.indexOf(firstDayOfMonth) === -1){
        months.push(firstDayOfMonth);
      }

      if(typeof monthlyRecords[firstDayOfMonth] == 'undefined'){
        monthlyRecords[firstDayOfMonth] = [record];
      } else {
        monthlyRecords[firstDayOfMonth].push(record);
      }

    }

    return {
      monthlyRecords,
      months
    };

  }

  let expenseRecords = extractRecordsFromExpenses(expenses);
  let incomeRecords = extractRecordsFromIncomes(incomes);

  let records = [...expenseRecords, ...incomeRecords];

  return segregeteToMonthlyRecords(records);

}

export function getMonthDetails(monthRecords) {

  let income = 0;
  let expense = 0;

  for (let record of monthRecords) {

    if(record.type == Map.EXPENSE){
      expense += parseFloat(record.amount);
    } else {
      income += parseFloat(record.amount);
    }

  }

  let remaining = income - expense;

  return {
    income,
    expense,
    remaining
  };

}