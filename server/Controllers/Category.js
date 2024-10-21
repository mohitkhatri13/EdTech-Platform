const Category = require("../models/Category.model")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
//flow of course = category -> course ->section -> subsection
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(401).
        json({
          success: false,
          message: "Al fields are required"
        })
    }
    const CategoryDetails = await Category.create({
      name: name,
      description: description
    })

    // console.log(CategoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created Successfully"
    })
  }
  catch (error) {
    return res.status(401).
      json({
        success: false,
        message: error.message
      })
  }
}

//get all handler functions

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true })
    return res.status(200).json({
      success: true,
      message: "All Categories returned Successfully",
      allCategories
    })
  }
  catch (error) {
    return res.status(401).
      json({
        success: false,
        message: error.message
      })
  }
}
//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body
    // console.log("hello");
    // console.log(categoryId);
    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",  // here path refers to the field (course) which is present in db and we have to populate it 
        match: { status: "Published" }, // Filters only published courses
        populate: "ratingAndReviews",
      })
      .exec()
    // console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no courses
    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },   // ne - not equal operator it return the all id except the given 
    })

    //  console.log(categoriesExceptSelected);

    let differentCategory;

    if (categoriesExceptSelected.length !== 0) {
      differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "course",
          match: { status: "Published" },
        })
        .exec()
    }
    // console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor"
        }   // in this type of populate method we can also add more options like selecting specific fields  but inthe above one we are not able to more customize it 
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.course)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}