const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    }
});

const User = mongoose.model('Users', userSchema);



const categorySchema = new Schema({
    userId: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
});

const ExpenseCategory = mongoose.model('ExpenseCategories', categorySchema);


const budgetPlanSchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
})

const monthlyBudgetPlanSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    incomeAmount: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    budgetPlan: [
        budgetPlanSchema
    ]

});

const MonthlyBudgetPlan= mongoose.model('MonthlyBudgetPlans', monthlyBudgetPlanSchema);

const expenseSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    // notes: String
});
const Expense = mongoose.model('Expenses', expenseSchema);
module.exports={ User, MonthlyBudgetPlan, ExpenseCategory, Expense, User }