const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors');
const path = require("path");
const connectDB=require('./database.js')
const dotenv=require("dotenv");
dotenv.config({path:path.join(__dirname, "./.env")});
const categoryRoutes =require("./routers/categoriesRouter.js");
const expenseRoutes =require("./routers/expensesRouter.js");
const budgetPlanRoutes =require("./routers/budgetPlansRouter.js");

const bodyParser=require("body-parser");

dotenv.config();
const app = express();

const port = process.env.PORT;

connectDB();

// Middleware
app.use(express.json());
app.use(
  cors()
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router
app.use("/api/category", categoryRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/monthlybudget", budgetPlanRoutes);


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})