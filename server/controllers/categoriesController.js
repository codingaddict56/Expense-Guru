
const { ExpenseCategory } = require("../models");

const addCategoryController = async (req, res) => {
  try {
    const category = new ExpenseCategory({ ...req.body });

    //   const user = await User.findById(userId);

    //   if (!user) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "User not found",
    //     });
    //   }

    let newCategory = await ExpenseCategory.create(category);
    console.log(newCategory);

    return res.status(200).json({
      success: true,
      message: "Category Added Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messages: err.message,
    });
  }

  
};
const fetchCategoriesController = async (req, res) => {
  try {
    
    const categories = await ExpenseCategory.find();

    
    if (!categories) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    
    return res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const fetchCategoriesByUser = async (req, res) => {
  try {

    let query={
      $or: [
          { userId: parseInt( req.query.userid) },
          { userId: 0 }
      ]};
      console.log(query)
    let categories = await ExpenseCategory.find({
      $or: [
          { userId: parseInt( req.query.userid) },
          { userId: 0 }
      ]});

      console.log(categories)
    return res.status(200).json({
      content: categories,
      success: true,
      message: "Categories Fetched Successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }

}

module.exports = {addCategoryController,fetchCategoriesController, fetchCategoriesByUser};