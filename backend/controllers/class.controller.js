import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
//POST -> Create classes


export const createClass = async (req, res) => {
  try {
    const { name, section, capacity, teacherId, academicYear } = req.body;

    // 1. Validate input data
    if (!name || !section || !capacity || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (name, section, capacity, academicYear)"
      });
    }

    // 2. Validate academic year format (YYYY-YYYY)
    if (!/^\d{4}-\d{4}$/.test(academicYear)) {
      return res.status(400).json({
        success: false,
        message: "Academic year must be in format YYYY-YYYY (e.g., 2023-2024)"
      });
    }

    // 3. Validate capacity range
    if (capacity < 10 || capacity > 50) {
      return res.status(400).json({
        success: false,
        message: "Class capacity must be between 10 and 50 students"
      });
    }

    // 4. Check for duplicate class (same name + section + academicYear)
    const existingClass = await Class.findOne({ name, section, academicYear });
    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: `Class ${name} ${section} already exists for ${academicYear}`
      });
    }

    // 5. Validate teacher if provided
    if (teacherId) {
      // First check if it's a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teacher ID format"
        });
      }

      const teacher = await User.findOne({ 
        _id: teacherId, 
        role: 'teacher'
        // Removed status check since your schema doesn't show a status field
      }).select('personalInfo.name teacherDetails');
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }

      // Check if teacher is already assigned to maximum classes (optional)
      const teacherClassesCount = await Class.countDocuments({ teacherId });
      if (teacherClassesCount >= 3) { // Assuming max 3 classes per teacher
        return res.status(400).json({
          success: false,
          message: "Teacher already assigned to maximum number of classes"
        });
      }
    }

    // 6. Create the class
    const newClass = await Class.create({
      name,
      section,
      capacity,
      teacherId: teacherId || null,
      academicYear,
      // Initialize fee structure with default values
      feeStructure: {
        annualFee: 0,
        tuitionFee: 0,
        admissionFee: 0,
        otherCharges: 0
      }
    });

    // 7. Update teacher's assigned classes if teacher was specified
    if (teacherId) {
      await User.findByIdAndUpdate(
        teacherId,
        {
          $addToSet: {
            "teacherDetails.assignedClasses": { 
              classId: newClass._id,
              className: `${name} ${section}`,
              academicYear 
            },
          },
        }
      );
    }

    // 8. Return the created class with populated teacher data
    const populatedClass = await Class.findById(newClass._id)
      .populate('teacherId', 'personalInfo.name personalInfo.email role');

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: populatedClass
    });

  } catch (err) {
    console.error("Error creating class:", err);
    
    // Handle specific errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

//Post -> Add student
export const addStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    // 1. Add students to class
    await Class.findByIdAndUpdate(req.params.id, {
      $addToSet: { students: { $each: studentIds } },
    });

    // 2. Update students' classInfo
    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        status: "active",
        "classInfo.current": {
          classId: req.params.id,
          name: await getClassName(req.params.id),
          section: await getClassSection(req.params.id),
        },
      }
    );

    res.json({ success: true, message: "Students added to class" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/classController.js
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacherId", "personalInfo  email")
      .populate("students", "name dob");

    res.json({
      success: true,
      data: classes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: err.message,
    });
  }
};

export const addStudentsToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;

    // Validate class exists
    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Validate studentIds is an array
    if (!Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: "studentIds must be an array",
      });
    }

    // Check class capacity
    const currentStudents = classData.students || [];
    if (currentStudents.length + studentIds.length > classData.capacity) {
      return res.status(400).json({
        success: false,
        message: `Class capacity exceeded (Max: ${classData.capacity})`,
      });
    }

    // Validate all student IDs exist
    const existingStudents = await Student.countDocuments({
      _id: { $in: studentIds }
    });
    if (existingStudents !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more student IDs are invalid",
      });
    }

    // Add students to class
    await Class.findByIdAndUpdate(id, {
      $addToSet: { students: { $each: studentIds } },
    });

    // Update students' class info
    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        status: "active",
        "classInfo.current": {
          id,
          name: classData.name,
          section: classData.section,
          academicYear: classData.academicYear,
        },
      }
    );

    res.json({
      success: true,
      message: `${studentIds.length} students added successfully`,
      data: {
        id,
        addedCount: studentIds.length,
        newTotalStudents: currentStudents.length + studentIds.length,
      }
    });
  } catch (err) {
    console.error("Error adding students:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add students",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const getClassDetails = async (req, res) => {
  try {
    const { id: classId } = req.params;

    // Find the class and populate teacher details
    const classData = await Class.findById(classId)
      .populate({
        path: 'teacherId',
        select: 'personalInfo.name personalInfo.email personalInfo.phone'
      })
      .lean();

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Get student details if there are students enrolled
    let students = [];
    if (classData.students && classData.students.length > 0) {
      students = await Student.find(
        { _id: { $in: classData.students } },
        '_id name personalInfo.image status'
      ).lean();
    }

    // Prepare response data
    const responseData = {
      ...classData,
      students: students.map(student => ({
        _id: student._id,
        name: student.name,
        image: student.personalInfo?.image || '/default-student.png',
        status: student.status
      }))
    };

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching class details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching class details',
      error: error.message
    });
  }
};
