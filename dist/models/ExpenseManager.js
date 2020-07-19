class ExpenseManager {
  constructor() {
    this._data = {
      expenses: [],
    };
  }

  addExpense = (expense) => {
    $.post(`/new`, expense, (res) => {
      this._data.expenses.push(res);
    });
  };

  getExpenses = (expense) => {
    $.get(`/expenses`, (res) => {
      this._data.expenses = res;
    });
  };
}
