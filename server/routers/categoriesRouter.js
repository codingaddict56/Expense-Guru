const express= require ('express');
const { addCategoryController, fetchCategoriesController, fetchCategoriesByUser } = require ('../controllers/categoriesController.js');

const router = express.Router();
router.route("/add").post(addCategoryController);
router.route("/all").get(fetchCategoriesController);
router.get("/", fetchCategoriesByUser);

module.exports=router;