const { Expense } = require('../models');

// Function to fetch all expenses
const fetchExpensesController = async (req, res) => {
    try {
        const expenses = await Expense.find({});
        res.status(200).json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to add a new expense
const addExpenseController = async (req, res) => {
    try {
        const { userId, category, amount, notes } = req.body;
        let date=new Date();
        
        const newExpense = new Expense({
            userId,
            category,
            date,
            amount,
            notes
        });

      
        await newExpense.save(newExpense)

        res.status(201).json(newExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to edit an existing expense
const editExpenseController = async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(updatedExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete an existing expense
const deleteExpenseController = async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to fetch allocated monthly expense
const fetchExpensesMonthlyController = async (req, res) => {
    try {
  
      let last6Months=[];
      last6Months.push ({ month: req.query.month, year: req.query.year});
      for(var i = 6; i > 0; i -= 1) {
        d = new Date(req.query.year, req.query.month - i, 1);
        last6Months.push ({ month: d.getMonth(), year: d.getFullYear()});
      }
      const lastDay= new Date(parseInt(req.query.year), parseInt(req.query.month)+1,0);
      const firstDay = new Date(parseInt(req.query.year), parseInt(req.query.month)-6,1);
      let expenses =await Expense.find({userId: parseInt(req.query.userid), date: { $gte: firstDay, $lte:lastDay }});

      return res.status(200).json({
        content: expenses,
        success: true,
        message: "Expenses Fetched Successfully",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        messages: err.message,
      });
    }
  };
  

module.exports = {
    fetchExpensesController,
    addExpenseController,
    editExpenseController,
    deleteExpenseController,
    fetchExpensesMonthlyController
};
