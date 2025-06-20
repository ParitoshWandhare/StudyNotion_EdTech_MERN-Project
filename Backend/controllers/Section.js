const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');


exports.createSection = async (req, res) => {
    try {
        //data fetch
        //data validation
        //check course exists
        //create section
        //update course with section ObjectId
        //res return
		
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

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
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};




exports.updateSection = async (req, res) => {
    try{
        //fetch data
        //validate data
        //update data
        //return response

        const {sectionName, sectionID, courseId} = req.body;

        if(!sectionName || !sectionID){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const section = await Section.findByIdAndUpdate(sectionID,
                                                                {
                                                                    sectionName
                                                                },
                                                                {
                                                                    new: true
                                                                });


        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate:{
                path: "subSection",
            }
        }).exec()

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            data:course,
        })
    }
    catch{
        res.status(500).json({
            success: false,
    })
}
}



exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});

	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};