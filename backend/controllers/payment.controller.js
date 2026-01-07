import dotenv from "dotenv";
dotenv.config();

import Fee from "../models/fee.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import PDFDocument from "pdfkit";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
};

if (!razorpayConfig.key_id || !razorpayConfig.key_secret) {
  throw new Error("Razorpay credentials missing in environment variables");
}

const razorpay = new Razorpay(razorpayConfig);


export const getStudentFeeDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const feeRecord = await Fee.findOne({ studentId })
      .populate("classId", "name section academicYear")
      .lean();

    if (!feeRecord) {
      return res.status(404).json({ error: "No fee record found" });
    }

    // Calculate payment status
    const totalPaid =
      feeRecord.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

    const feeItems =
      feeRecord.feeItems?.map((item) => {
        // Check if item is explicitly marked as paid OR if it's included in any payment's feeItems
        const isPaid =
          item.isPaid ||
          feeRecord.payments?.some(
            (payment) =>
              payment.feeItems.includes(item.name) ||
              // If all fees were paid (totalPaid covers all items)
              totalPaid >=
                feeRecord.feeItems.reduce((sum, i) => sum + i.amount, 0)
          );
        return {
          ...item,
          isPaid,
          dueDate: item.dueDate?.toISOString().split("T")[0] || "Not set",
        };
      }) || [];

    const totalDue = feeItems.reduce(
      (sum, item) => (item.isPaid ? sum : sum + item.amount),
      0
    );

    const pastPayments =
      feeRecord.payments?.map((p) => ({
        id: p._id.toString(),
        date: p.paymentDate.toLocaleDateString("en-IN"),
        amount: p.amount,
        type: p.mode,
        transactionId: p.razorpayPaymentId || "N/A",
        feeItems: p.feeItems,
        receiptUrl: `/api/fee/receipt/${p._id}`,
      })) || [];

    res.json({
      studentData: {
        name: feeRecord.studentName || "N/A",
        uniqueId: studentId,
        class: feeRecord.classId.name,
        section: feeRecord.classId.section,
        batch: feeRecord.classId.academicYear,
      },
      feeItems,
      paymentSummary: {
        totalDue,
        totalPaid,
      },
      pastPayments,
    });
  } catch (error) {
    console.error("Failed to fetch fee details:", error);
    res.status(500).json({
      error: "Failed to fetch fee details",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 2. Enhanced Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    // 1. Validate environment
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured in .env");
    }

    // 3. Initialize Razorpay with validation
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 4. Create order with error handling
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        studentId: req.body.studentId,
        feeItemIds: req.body.feeItemIds.join(","),
      },
    });

    res.json({
      success: true,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Payment Error:", {
      status: err.statusCode,
      error: err.error?.code,
      description: err.error?.description,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    res.status(err.statusCode || 500).json({
      error: "Payment failed",
      reason: err.error?.description || err.message,
      action:
        err.statusCode === 401
          ? "1. Check Razorpay keys\n2. Verify test/live mode\n3. Restart server"
          : "Contact support",
    });
  }
};


// 4. Enhanced Receipt Generation
export const generateReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const feeRecord = await Fee.findOne({ "payments._id": paymentId })
      .populate("studentId", "name rollNumber")
      .populate("classId", "name section");

    if (!feeRecord) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = feeRecord.payments.id(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const doc = new PDFDocument({ margin: 50 });
    const filename = `Fee_Receipt_${paymentId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    // PDF Styling
    const primaryColor = "#3498db";
    const secondaryColor = "#7f8c8d";

    // Header
    doc
      .image("public/school_logo.png", 50, 45, { width: 50 })
      .fillColor(primaryColor)
      .fontSize(20)
      .text("FEE PAYMENT RECEIPT", 200, 50, { align: "center" })
      .fontSize(10)
      .fillColor(secondaryColor)
      .text(`Receipt #: ${paymentId}`, 200, 80, { align: "center" })
      .moveDown();

    // School Info
    doc
      .fillColor("#000")
      .fontSize(10)
      .text("School Name:", 50, 120)
      .text("Example International School", 150, 120)
      .text("Address:", 50, 135)
      .text("123 Education Street, Knowledge City", 150, 135)
      .moveTo(50, 160)
      .lineTo(550, 160)
      .stroke();

    // Student Details
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .text("Student Details", 50, 170)
      .fontSize(10)
      .fillColor("#000")
      .text(`Name: ${feeRecord.studentId.name}`, 50, 200)
      .text(
        `Class: ${feeRecord.classId.name} - ${feeRecord.classId.section}`,
        50,
        215
      )
      .text(`Roll No: ${feeRecord.studentId.rollNumber || "N/A"}`, 50, 230)
      .text(`Academic Year: ${feeRecord.academicYear}`, 50, 245)
      .moveTo(50, 265)
      .lineTo(550, 265)
      .stroke();

    // Payment Details
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .text("Payment Information", 50, 275)
      .fontSize(10)
      .fillColor("#000")
      .text(`Amount: ₹${payment.amount.toFixed(2)}`, 50, 305)
      .text(
        `Payment Date: ${payment.paymentDate.toLocaleDateString("en-IN")}`,
        50,
        320
      )
      .text(`Transaction ID: ${payment.razorpayPaymentId || "N/A"}`, 50, 335)
      .text(`Payment Mode: ${payment.mode.toUpperCase()}`, 50, 350)
      .moveTo(50, 370)
      .lineTo(550, 370)
      .stroke();

    // Footer
    doc
      .fontSize(8)
      .fillColor(secondaryColor)
      .text("This is a computer generated receipt.", 50, 750, {
        align: "center",
      })
      .text("For any queries, contact accounts@school.edu", 50, 765, {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Receipt generation error:", error);
    res.status(500).json({
      error: "Failed to generate receipt",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const { studentId } = req.params;

    // 1. Validate inputs
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Missing payment parameters" });
    }

    // 2. Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 3. Get Razorpay order
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (order.status !== "paid") {
      await session.abortTransaction();
      return res.status(400).json({ error: "Payment not completed" });
    }

    // 4. Get class info
    const studentClass = await Class.findOne({ students: studentId }).session(
      session
    );
    if (!studentClass) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Student not in any class" });
    }

    // 5. Process fee items
    const feeItemNames = order.notes?.feeItemIds?.split(",") || [];
    const isPayingAll = feeItemNames.includes("all");
    const paidDate = new Date();

    // 6. Define all fee items
    const allFeeItems = [
      { name: "Annual Fee", amount: studentClass.feeStructure.annualFee },
      { name: "Tuition Fee", amount: studentClass.feeStructure.tuitionFee },
      { name: "Admission Fee", amount: studentClass.feeStructure.admissionFee },
      { name: "Other Charges", amount: studentClass.feeStructure.otherCharges },
    ];

    // 7. Determine which fees were paid
    const paidFeeItems = isPayingAll
      ? allFeeItems
      : allFeeItems.filter((item) =>
          feeItemNames.includes(item.name.replace(" Fee", "").toLowerCase())
        );

    // 8. Create payment record
    const paymentRecord = {
      amount: order.amount / 100,
      paymentDate: paidDate,
      mode: "online",
      razorpayPaymentId: razorpay_payment_id,
      feeItems: paidFeeItems.map((item) => item.name),
    };

    // 9. Find or create fee document
    let feeRecord = await Fee.findOne({ studentId }).session(session);

    if (!feeRecord) {
      // Create new fee record
      feeRecord = new Fee({
        studentId,
        classId: studentClass._id,
        feeItems: allFeeItems.map((item) => ({
          ...item,
          isPaid: paidFeeItems.some((paid) => paid.name === item.name),
        })),
        payments: [paymentRecord],
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      });

      await feeRecord.save({ session });
    } else {
      // Update existing record
      const updateOperation = {
        $push: { payments: paymentRecord },
        $set: {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          updatedAt: paidDate,
        },
      };

      // Update paid status for each fee item
      paidFeeItems.forEach((item) => {
        updateOperation.$set[`feeItems.$[elem].isPaid`] = true;
        updateOperation.$set[`feeItems.$[elem].paidDate`] = paidDate;
      });

      await Fee.updateOne({ _id: feeRecord._id }, updateOperation, {
        session,
        arrayFilters: [
          { "elem.name": { $in: paidFeeItems.map((item) => item.name) } },
        ],
      });
    }

    await session.commitTransaction();

    res.json({
      success: true,
      receiptId: razorpay_payment_id,
      paidAmount: order.amount / 100,
      paidItems: paidFeeItems.map((item) => item.name),
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Payment verification failed:", error);
    res.status(500).json({
      error: "Payment verification failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

