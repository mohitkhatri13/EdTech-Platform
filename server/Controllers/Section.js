const Section = require("../models/section")
const Course = require("../models/coursemodel")
const subSection = require("../models/subsection.model")

exports.createSection = async (req, res) => {
    try {
        //data fetching
        const { sectionName, CourseId } = req.body;
        //datavalidation
        if (!sectionName || !CourseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //create section
        const newSection = await Section.create({
            sectionName
        });
        //updated course with section objectId
        console.log(newSection)
        const updatedCourseDetails = await Course.findByIdAndUpdate(CourseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            }
            ,
            { new: true }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();

        // HW - use populate to replace sections.sucsections both in the updateedCOurseDetails


        return res.status(200).json({
            success: true,
            message: "Section created Successfully",
            updatedCourseDetails
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