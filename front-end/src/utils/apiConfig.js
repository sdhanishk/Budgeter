const baseUrl = "http://localhost:8080"

const apis = {
    expenses: `${baseUrl}/expenses`,
    incomes: `${baseUrl}/incomes`,
    accountsIds: `${baseUrl}/accounts-ids-map`,
    paymentTypesIds: `${baseUrl}/payment-types-ids-map`,
    paymentTypes: `${baseUrl}/payment-types`,
    categories: `${baseUrl}/categories`,
    carryOver: `${baseUrl}/carry-over`,
    accounts: `${baseUrl}/accounts`,
    addIncome: `${baseUrl}/add-income`,
    addExpense: `${baseUrl}/add-expense`
}

export {apis};