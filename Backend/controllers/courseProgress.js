const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")


exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body
    const userId = req.user.id

    // Validate subsection existence
    // const subsection = await SubSection.findById(subSectionId)
    // if (!subsection) {
    //   return res.status(404).json({ success: false, error: "Invalid subsection" })
    // }

    // Try to find CourseProgress document
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    // If not found, create a new one
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [subSectionId],
      })

      return res.status(200).json({
        success: true,
        message: "Course progress initialized and updated",
        courseProgress,
      })
    }

    // If already completed, prevent duplicate
    if (courseProgress.completedVideos.includes(subSectionId)) {
      return res.status(400).json({
        success: false,
        error: "Subsection already completed",
      })
    }

    // Add subSectionId and save
    courseProgress.completedVideos.push(subSectionId)
    await courseProgress.save()

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
      courseProgress,
    })

  } catch (error) {
    console.error("Error updating course progress:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error in course progress update",
    })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }
