import Fee from "../models/fee.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";

// controllers/feeController.js
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("studentId", "name classInfo.current.name")
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: fees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fee records",
      error: err.message,
    });
  }
};

export const sendFeeReminder = async (req, res) => {
  try {
    const { feeId } = req.body;

    // 1. Fetch fee record
    const fee = await Fee.findById(feeId).populate("student");
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // 2. Send email/SMS logic (pseudo-code)
    await sendNotification({
      to: fee.student.parentEmail,
      message: `Reminder: Fee of ₹${fee.amount} due on ${fee.dueDate}`,
    });

    // 3. Update fee status
    fee.lastReminderSent = new Date();
    await fee.save();

    res.json({ message: "Reminder sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reminder" });
  }
};

// // get SET CLASS-WISE FEE STRUCTURE (Super Admin)
export const getClassFeeStructure = async (req, res) => {
  try {
    const { classId } = req.params;

    if (classId) {
      const classDoc = await Class.findById(classId);

      if (!classDoc) {
        return res.status(404).json({ error: "Class not found" });
      }

      if (
        !classDoc.feeStructure ||
        Object.keys(classDoc.feeStructure).length === 0
      ) {
        return res.status(404).json({ error: "Fee structure not set for this class" });
      }

      return res.json({
        success: true,
        classId: classDoc._id,
        className: classDoc.name,
        feeStructure: classDoc.feeStructure,
      });
    }

    // If classId not provided – return fee structures of all classes
    const allClasses = await Class.find({
      feeStructure: { $exists: true, $ne: {} },
    }).select("name feeStructure");

    if (allClasses.length === 0) {
      return res.status(404).json({ error: "No fee structures found" });
    }

    return res.json({
      success: true,
      count: allClasses.length,
      classes: allClasses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SET CLASS-WISE FEE STRUCTURE (Create Only if Not Set)
export const setClassFees = async (req, res) => {
  try {
    const { classId, annualFee, tuitionFee, admissionFee, otherCharges } =
      req.body;

    const classDoc = await Class.findById(classId);

    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if feeStructure already exists
    if (
      classDoc.feeStructure &&
      Object.keys(classDoc.feeStructure).length > 0
    ) {
      return res
        .status(400)
        .json({ error: "Fee structure already set. You can only edit it." });
    }

    classDoc.feeStructure = {
      annualFee,
      tuitionFee,
      admissionFee,
      otherCharges,
    };

    await classDoc.save();

    res.json({ message: "Fee structure set successfully", data: classDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (Edit) FEE STRUCTURE
export const editClassFees = async (req, res) => {
  try {
    const { classId, annualFee, tuitionFee, admissionFee, otherCharges } = req.body;

    const classDoc = await Class.findById(classId);

    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    classDoc.feeStructure = {
      annualFee,
      tuitionFee,
      admissionFee,
      otherCharges,
    };

    await classDoc.save();

    res.json({ message: "Fee structure updated successfully", data: classDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 2. ADD ONE-TIME FEE (e.g., Sports Fee)

export const addOneTimeFee = async (req, res) => {
  try {
    const { classId, feeName, amount, dueDate } = req.body;

    // Verify class exists
    const classExists = await Class.findById(classId);
    if (!classExists) return res.status(404).json({ error: "Class not found" });

    // Find students
    const students = await Student.find({
      "classInfo.current.classId": classId,
    });
    if (students.length === 0) {
      return res.status(400).json({ error: "No students in this class" });
    }

    // Create fees
    const fees = await Promise.all(
      students.map((student) =>
        Fee.create({
          studentId: student._id,
          classId,
          feeItems: [{ name: feeName, amount: Number(amount) }],
          dueDate: new Date(dueDate),
          status: "pending",
        })
      )
    );

    // Return meaningful response
    res.json({
      success: true,
      message: `Fee added to ${fees.length} students`,
      feeName,
      totalAmount: amount * students.length,
      class: classExists.name,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export const getOneTimeFees = async (req, res) => {
  try {
    const { classId, studentId } = req.query;

    let query = {};

    // Filter by student
    if (studentId) {
      query.studentId = studentId;
    }

    // Filter by class
    if (classId) {
      query.classId = classId;
    }

    // Fetch only one-time fees (assuming `feeItems` has only one item for one-time fee)
    const fees = await Fee.find(query)
      .populate("studentId", "name classInfo")
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    // if (fees.length === 0) {
    //   return res.status(404).json({ message: "No one-time fees found." });
    // }

    res.json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

// 3. GET OVERDUE FEES
export const getOverdueFees = async (req, res) => {
  try {
    const overdueFees = await Fee.find({
      status: "pending",
      dueDate: { $lt: new Date() },
    }).populate("studentId", "name");

    res.json(overdueFees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Fee Summary for Super Admin
export const getFeeSummary = async (req, res) => {
  try {
    // 1. Get all classes with their fee structure
    const classes = await Class.aggregate([
      {
        $group: {
          _id: "$name", // Group by class name
          feeStructure: { $first: "$feeStructure" },
          studentCount: { $sum: { $size: "$students" } },
          paidAnnualFee: { $sum: 0 }, // Placeholder logic
          paidTuitionFee: { $sum: 0 }, // Replace with actual counts later
          paidAdmissionFee: { $sum: 0 },
          paidOtherCharges: { $sum: 0 },
        },
      },
    ]);

    const feeComponentsSummary = classes.flatMap((cls) => {
      const components = [];

      const { annualFee, tuitionFee, admissionFee, otherCharges } =
        cls.feeStructure || {};
      const { studentCount, _id: className } = cls;

      if (annualFee) {
        components.push({
          name: "Annual Fee",
          feeType: "Annual Fee",
          className,
          definedFee: annualFee,
          totalPotential: annualFee * studentCount,
          totalCollected: annualFee * cls.paidAnnualFee,
          totalPending: annualFee * (studentCount - cls.paidAnnualFee),
          totalStudents: studentCount,
          paidStudents: cls.paidAnnualFee,
          pendingStudents: studentCount - cls.paidAnnualFee,
        });
      }

      if (tuitionFee) {
        components.push({
          name: "Tuition Fee",
          feeType: "Tuition Fee",
          className,
          definedFee: tuitionFee,
          totalPotential: tuitionFee * studentCount,
          totalCollected: tuitionFee * cls.paidTuitionFee,
          totalPending: tuitionFee * (studentCount - cls.paidTuitionFee),
          totalStudents: studentCount,
          paidStudents: cls.paidTuitionFee,
          pendingStudents: studentCount - cls.paidTuitionFee,
        });
      }

      if (admissionFee) {
        components.push({
          name: "Admission Fee",
          feeType: "Admission Fee",
          className,
          definedFee: admissionFee,
          totalPotential: admissionFee * studentCount,
          totalCollected: admissionFee * cls.paidAdmissionFee,
          totalPending: admissionFee * (studentCount - cls.paidAdmissionFee),
          totalStudents: studentCount,
          paidStudents: cls.paidAdmissionFee,
          pendingStudents: studentCount - cls.paidAdmissionFee,
        });
      }

      if (otherCharges) {
        components.push({
          name: "Other Charges",
          feeType: "Other Charges",
          className,
          definedFee: otherCharges,
          totalPotential: otherCharges * studentCount,
          totalCollected: otherCharges * cls.paidOtherCharges,
          totalPending: otherCharges * (studentCount - cls.paidOtherCharges),
          totalStudents: studentCount,
          paidStudents: cls.paidOtherCharges,
          pendingStudents: studentCount - cls.paidOtherCharges,
        });
      }

      return components;
    });

    // 2. One-time fees (unchanged but added className & feeType fields)
    const oneTimeFees = await Fee.aggregate([
      { $unwind: "$feeItems" },
      {
        $group: {
          _id: "$feeItems.name",
          definedFee: { $first: "$feeItems.amount" },
          totalPotential: { $sum: "$feeItems.amount" },
          totalCollected: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$feeItems.amount", 0],
            },
          },
          totalStudents: { $sum: 1 },
          paidStudents: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const formattedOneTimeFees = oneTimeFees.map((fee) => ({
      name: fee._id,
      feeType: fee._id,
      className: "One-Time",
      definedFee: fee.definedFee,
      totalPotential: fee.totalPotential,
      totalCollected: fee.totalCollected,
      totalPending: fee.totalPotential - fee.totalCollected,
      totalStudents: fee.totalStudents,
      paidStudents: fee.paidStudents,
      pendingStudents: fee.totalStudents - fee.paidStudents,
    }));

    res.json([...feeComponentsSummary, ...formattedOneTimeFees]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
