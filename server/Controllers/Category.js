const Category = require("../models/Category.model")
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

        console.log(CategoryDetails);
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
        // get category id'
        const { categoryid } = req.body;
        // get courses for specified category id 
        const selectedCategory = await Category.findById(categoryid)
            .populate("courses")
            .exec();
        // validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                messaage: "Data not found"
            })
        }
        // get courses for different cateogories 
        const differentcategories = await Category.find(
            //ne - not equal
            { _id: { $ne: categoryid } }
        )
            .populate("courses")
            .exec()
        // get top selling courses
        //  homework 

        //return response 
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentcategories
            },
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            messaage: error.message
        })
    }
}