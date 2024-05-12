const express = require('express');
const router = express.Router();
const {
    fetchExpensesController,
    addExpenseController,
    editExpenseController,
    deleteExpenseController,
    fetchExpensesMonthlyController
} = require('../controllers/expensesController');

//Middleware to log incoming requests
router.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url, req.body);
    next(); 
});

//routes
// Routes to perform CRUD operations on expenses
router.get('/expenses', fetchExpensesController);
router.post('/addExpenses', addExpenseController);
router.put('/editExpense/:id', editExpenseController);
router.delete('/deleteExpense/:id', deleteExpenseController);
router.get("/all",fetchExpensesMonthlyController);

module.exports = router;


