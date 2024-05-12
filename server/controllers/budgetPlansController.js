const { MonthlyBudgetPlan } = require("../models");
const mongoose = require("mongoose");


const addBudgetPlan = async (req, res) => {
  try {

    let budget = await MonthlyBudgetPlan.updateOne({ month: req.body.monthlyBudget.month, year: req.body.monthlyBudget.year }, req.body?.monthlyBudget);
    if (!budget?.upsertedId) {
      console.log(budget)
      const newBudget = new MonthlyBudgetPlan(req.body?.monthlyBudget)
      await newBudget.save()
      return res.status(201).send('Budget Created')
    }
    return res.status(201).send('Budget Created');
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
const fetchBudgetPlanMonthly = async (req, res) => {
  try {

    let last6Months = [];
    last6Months.push({ month: req.query.month, year: req.query.year });
    for (var i = 6; i > 0; i -= 1) {
      d = new Date(req.query.year, req.query.month - i, 1);
      last6Months.push({ month: d.getMonth(), year: d.getFullYear() });
    }

    const query = { userId: parseInt(req.query.userid), month: { $in: last6Months.map(m => m.month) }, year: { $in: last6Months.map(m => m.year) } }
    let budgetPlan = await MonthlyBudgetPlan.find(query);
    console.log(budgetPlan)
    return res.status(200).json({
      content: budgetPlan,
      success: true,
      message: "Budget Plan Fetched Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messages: err.message,
    });
  }
};

const fetchCategoriesByBudgetPlan = async (req, res) => {
  try {
    let categories = (await MonthlyBudgetPlan.find({ userId: parseInt(req.query.userid), month: new Date().getMonth(), year: new Date().getFullYear() }))?.[0];
    categories = categories?.budgetPlan?.map(c => c.category)
    return res.status(200).json({
      content: categories,
      success: true,
      message: "Categories Fetched Successfully",
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      messages: err.message,
    });

  }
}


const fetchBudgetPlan = async(req, res)=>{
  try{

    let date = new Date();
    let budgetPlan = await MonthlyBudgetPlan.find({userId:parseInt(req.query.userid), month: date.getMonth(), year:date.getFullYear()});
    console.log(budgetPlan)
    return res.status(200).json({
      content: budgetPlan,
      success: true,
      message: "Budget Plan Fetched Successfully",
    });  }catch(error){
    console.log(error)
    res.status(500).json(error)
  } 
}


module.exports = { addBudgetPlan, fetchBudgetPlanMonthly, fetchCategoriesByBudgetPlan, fetchBudgetPlan };
