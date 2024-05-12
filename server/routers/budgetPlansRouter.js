const express = require("express");
const { addBudgetPlan, fetchBudgetPlanMonthly, fetchCategoriesByBudgetPlan, fetchBudgetPlan } = require("../controllers/budgetPlansController");



const router = express.Router();

router.route("/categories").get(fetchCategoriesByBudgetPlan);
router.post('/add-BudgetPlan', addBudgetPlan)
router.route("/all").get(fetchBudgetPlanMonthly);
router.route("/").get(fetchBudgetPlan)



module.exports=router;