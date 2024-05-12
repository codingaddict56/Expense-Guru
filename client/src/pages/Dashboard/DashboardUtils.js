export const calculateTotalExpenses = (expenses) => {
    if (expenses) {
        if (expenses.length > 0)
            return expenses.map(e => e.amount).reduce(function (x, y) {
                return x + y;
            }, 0);
    }
    return 0;
}

export const calculateBalance = (incomeAmount, totalExpenses) => {
    return incomeAmount - totalExpenses;
}
