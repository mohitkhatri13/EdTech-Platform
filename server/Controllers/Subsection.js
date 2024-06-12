const subSection = require("../models/subsection.model");
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
const { findOne } = require("../models/profilemodel");
//create section
require("dotenv").config();
exports.createSubSection = async (req, res) => {
    try {
        //fetchdata
        const { sectionId, title, timeDuration, description } = req.body;
        // extract file/video
        const video = req.files.videofile;
        //validation
        if (!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "ALL fields are required",
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        );
        // create a sub section
        const subSectionDetails = await subSection.create({
            title: title,
            timeDuration: timeDuration,
            Description: description,
            VideoUrl: uploadDetails.secure_url,
        });
        // save the id of the subsection to the section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: subSectionDetails._id,
                },
            },
            { new: true }
        );

        // HW: - log updated section here after using populated here

        return res.status(200).json({
            success: true,
            message: "Sub Section created Successfully",
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message,
        });
    }
};

// hw- updated subsection - homwwork

exports.updateSubSection = async (req, res) => {
    try {
        const { SubsectionId, title, timeDuration, Description } = req.body;
        let video = req.files.videoFile;
        //validation
        if (!SubsectionId) {
            return res.status(400).json({
                success: false,
                message: "Subsection id is  required",
            });
        }
        //prepare the update data
        let updatedsubsectiondata = {
            ...(title && { title }),
            ...(timeDuration && { timeDuration }),
            ...(Description && { Description }),
        };
        if (video) {
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            updatedsubsectiondata = {
                ...updatedsubsectiondata,
                VideoUrl: uploadDetails.secure_url,
            };
        }
        // find the subsection by Id and update it
        const updatedSubSection = await subSection.findByIdAndUpdate(
            { _id: SubsectionId },
            { $set: updatedsubsectiondata },
            { new: true }
        );

        // If the subsection was not found, return an error
        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }

        // Return the updated subsection
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message,
        });
    }
};

// delete subsection - homework

exports.deleteSubSection = async (req, res) => {
    try {
        const { SubsectionId } = req.body;
        //validation
        if (!SubsectionId) {
            return res.status(400).json({
                success: false,
                message: "Subsection id is  required",
            });
        }
        // pehle isko section se delete krenge
        const section = await Section.findOne({ subSection: SubsectionId });
        console.log(section)
        if (section) {
            section.subSection.pull(SubsectionId);
            await section.save();
        }
        // ab subsection ko delete krenge
        await subSection.findByIdAndDelete(SubsectionId);

        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message,
        });
    }
};
