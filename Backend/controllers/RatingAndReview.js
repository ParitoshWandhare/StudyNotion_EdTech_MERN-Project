const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose")
//createRating
exports.createRating = async (req, res) => {
    try{
        //get user id
        //fetch data from body
        //check user is enrolled in course or not
        //check user already rated or not
        //create rating and review
        //update course with rating and review
        //return response

        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        const courseDetails = await Course.findOne({_id: courseId, studentsEnrolled: {$elemMatch: {$eq: userId}}});
        
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "You are not enrolled in this course"
            });
        }

        const alreadyReviewed = await RatingAndReview.findOne({user: userId, course: courseId});
        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "You have already rated this course"
            });
        }

        const ratingReview = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review
        });


        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
                                                    $push: {
                                                        ratingAndReviews: ratingReview
                                                    }
                                                }, { new: true });
    
        console.log(updatedCourseDetails);

        return res.status(200).json({
            success: true,
            message: "Rating and Review Created Successfully",
            data: ratingReview
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in Rating Creation"
        });
    }
}



//getAverageRating

exports.getAverageRating = async (req, res) => {
    try{
        //get courseId from body
        //calculate average rating
        //return rating
        //if no rating/review exist
        const courseId = req.body.courseId;


        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg: "$rating"},
                    
                }
            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                message: "Average Rating Fetched Successfully",
                averageRating: result[0].averageRating,
                
            });
        }

        return res.status(200).json({
            success: true,
            message: "No rating and review found",
            averageRating: 0,
            
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in Average Rating Calculation"
        });
    }
}





//getAllRatings
exports.getAllRatingReview = async (req, res) => {
    try{
        
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"})
                                                            .populate({path:"User", select:"firstName lastName email image"})
                                                            .populate({path:"course", select:"courseName"})
                                                            .exec()

        

        return res.status(200).json({
            success: true,
            message: "All Ratings and Reviews Fetched Successfully",
            data: allReviews
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in Fetching All Ratings"
        });
    }
}