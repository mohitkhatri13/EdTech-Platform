const Section = require("../models/section")
const Course = require("../models/coursemodel")
const subSection = require("../models/subsection.model")

exports.createSection = async (req, res) => {
    try {
        // Extract the required properties from the request body
        const { sectionName, courseId } = req.body
    
        // Validate the input
        if (!sectionName || !courseId) {
          return res.status(400).json({
            success: false,
            message: "Missing required properties",
          })
        }
    
        // Create a new section with the given name
        const newSection = await Section.create({ sectionName })
    
        // Add the new section to the course's content array
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            $push: {
              courseContent: newSection._id,
            },
          },
          { new: true }
        )
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        // Return the updated course object in the response
        res.status(200).json({
          success: true,
          message: "Section created successfully",
          updatedCourse,
        })
      } catch (error) {
        // Handle errors
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
}


//update section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, SectionId } = req.body;

        //data valdation
        if (!sectionName || !SectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // updatedata
        const updatedsection = await Section.findByIdAndUpdate(
            SectionId,
            { sectionName },
            { new: true })


        return res.status(200).json({
            success: true,
            message: "Section updated Successfully",
            updatedsection
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create the section plesase try again",
            error: error.message
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        // get id  assuming that we are sending id in params
        const { sectionid } = req.body;
        console.log(sectionid);
        // ek course me se id delete karni hai 
        const course = await Course.findOne({ courseContent: sectionid });

        if (course) {
            // Remove the section reference from the course
            course.courseContent.pull(sectionid);
            await course.save();
        }


        // ek subsection related to that section delete karna hai 4
        const section = await Section.findById(sectionid);

        if (!section) {
            return res.status(400).json({
                success: false,
                message: "Section not found"
            })
        }
        await subSection.deleteMany({ _id: { $in: section.subSection } });


        // than finally section delete karna hai 
        await Section.findByIdAndDelete(sectionid);
        //TODO - donwe need to delete the entry from the course schema
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete the section plesase try again",
            error: error.message
        })
    }
}