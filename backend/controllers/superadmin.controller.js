import Class from '../models/class.model.js';
import Student from '../models/student.model.js';
import User from '../models/user.model.js';

// 1. Create New Class
export const createClass = async (req, res) => {
  try {
    const { name, section, academicYear, capacity, feeStructure, teacherId } = req.body;

    // Validate academic year format (YYYY-YYYY)
    if (!/^\d{4}-\d{4}$/.test(academicYear)) {
      return res.status(400).json({ error: "Academic year must be in format YYYY-YYYY" });
    }

    // Validate teacher exists and has teacher role
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
        return res.status(400).json({ error: "Invalid teacher assignment" });
      }
    }

    const newClass = await Class.create({
      name,
      section,
      academicYear,
      capacity: capacity || 20,
      feeStructure,
      teacherId
    });

    // If teacher assigned, update teacher's assignedClasses
    if (teacherId) {
      await User.findByIdAndUpdate(teacherId, {
        $addToSet: { 'teacherDetails.assignedClasses': { classId: newClass._id } }
      });
    }

    res.status(201).json(newClass);

  } catch (err) {
    res.status(500).json({ 
      error: "Class creation failed",
      details: err.message 
    });
  }
};

// 2. Assign Students to Class
export const addStudentsToClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;

    // Validate class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check capacity
    if (classObj.students.length + studentIds.length > classObj.capacity) {
      return res.status(400).json({ 
        error: "Class capacity exceeded",
        available: classObj.capacity - classObj.students.length
      });
    }

    // Validate all students exist and are active
    const invalidStudents = await Student.find({
      _id: { $in: studentIds },
      status: { $ne: "active" }
    });

    if (invalidStudents.length > 0) {
      return res.status(400).json({
        error: "Some students are inactive",
        invalidIds: invalidStudents.map(s => s._id)
      });
    }

    // Update class
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: { $each: studentIds } }},
      { new: true }
    );

    // Update each student's classInfo
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { 
        $set: { 
          'classInfo.current': {
            classId,
            name: classObj.name,
            section: classObj.section,
            academicYear: classObj.academicYear
          }
        } 
      }
    );

    res.json({
      success: true,
      addedCount: studentIds.length,
      class: updatedClass
    });

  } catch (err) {
    res.status(500).json({ 
      error: "Student assignment failed",
      details: err.message 
    });
  }
};

// 3. Get Class Details
export const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;

    const classDetails = await Class.findById(classId)
      .populate('teacherId', 'personalInfo.name')
      .populate('students', 'name classInfo.current.section');

    if (!classDetails) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json(classDetails);

  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch class details",
      details: err.message 
    });
  }
};

// 4. Get All Classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacherId', 'personalInfo.name')
      .select('-students'); // Exclude students array for performance

    res.json(classes);

  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch classes",
      details: err.message 
    });
  }
};

// 5. Update Class Information
export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const updates = req.body;

    // Prevent students array modification via this route
    if (updates.students) {
      return res.status(400).json({ 
        error: "Use dedicated endpoint for student management" 
      });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId, 
      updates, 
      { new: true, runValidators: true }
    );

    res.json(updatedClass);

  } catch (err) {
    res.status(500).json({ 
      error: "Class update failed",
      details: err.message 
    });
  }
};

// 6. Remove Student from Class
export const removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    // Remove from class
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $pull: { students: studentId } },
      { new: true }
    );

    // Clear student's class info
    await Student.findByIdAndUpdate(studentId, {
      $unset: { 'classInfo.current': 1 }
    });

    res.json({
      success: true,
      class: updatedClass
    });

  } catch (err) {
    res.status(500).json({ 
      error: "Failed to remove student",
      details: err.message 
    });
  }
};