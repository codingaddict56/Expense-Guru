const host = "http://localhost:3001";
export const fetchAllExpensesAPI = `${host}/api/expense/all`;
export const fetchAllBudgetPlansAPI = `${host}/api/monthlybudget/all`;
export const addBudgetPlanAPI =   `${host}/api/monthlybudget/add-BudgetPlan`;
export const fetchBudgetPlanCategoriesAPI =`${host}/api/monthlybudget/categories?userid=1`
export const fetchCategoriesAPI  = `${host}/api/category/all`;
export const  addCategoryAPI      = `${host}/api/category/add`;
export const fetchCurrentBudgetPlanAPI = `${host}/api/monthlybudget?userid=1`
export const fetchCategoriesByUserAPI =`${host}/api/category?userid=1`


