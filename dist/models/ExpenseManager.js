class ExpenseManager {
  constructor() {
    this._data = {
      expenses: [],
    };
  }

  addExpense = async (expense) => {
    let data = await $.post('/expenses', expense);
    this._data.expenses.push(data);
  };

  getExpenses = async () => {
    let data = await $.get(`/expenses`);
    this._data.expenses = data;
  };
}
