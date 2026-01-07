import React, { useState, useEffect } from "react";
import { User, CreditCard, Calendar, Receipt } from "lucide-react";
import axios from "axios";
import axiosInstance from "../services/axiosConfig";

import Razorpay from "razorpay";

const FeeManagementPage = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    uniqueId: "",
    class: "",
    batch: "",
  });
  const [feeItems, setFeeItems] = useState([]);
  const [pastPayments, setPastPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const allFeesPaid = feeItems.every((item) => item.isPaid);
  // Get student ID from localStorage
  const getStudentId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.children && user.children.length > 0) {
        return user.children[0]._id; // Assuming you want the first child
      }
      return null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };
  const studentId = getStudentId();

  if (!studentId) {
    throw new Error("No student ID found");
  }
  // Calculate total amount
  const calculateTotal = () => {
    return feeItems.reduce((total, item) => total + item.amount, 0);
  };

  // Load all student fee data

  const fetchStudentFeeData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/fee/students/${studentId}/fees`
      );

      if (response.data.error) {
        // Handle specific errors
        if (response.data.error.includes("not assigned")) {
          alert("Student is not assigned to any class");
        } else if (response.data.error.includes("fee structure not set")) {
          alert("Class fee structure not set by admin");
        }
        return;
      }

      setStudentData(response.data.studentData);
      setFeeItems(response.data.feeItems);
      setPastPayments(response.data.pastPayments);
    } catch (error) {
      console.error("Failed to fetch fee data:", error);
      alert("Failed to load fee details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    try {
      setPaymentProcessing(true);
      const amount = calculateTotal();

      // Verify Razorpay is available
      if (!window.Razorpay) {
        throw new Error(
          "Payment service not available. Please refresh the page."
        );
      }

      // Get fee item IDs being paid
      const feeItemIds = feeItems
        .filter((item) => !item.isPaid)
        .map((item) => item._id);

      if (feeItemIds.length === 0) {
        throw new Error("No fees to pay - all items are already paid");
      }

      // Create order with fee items information
      const orderResponse = await axiosInstance.post("/fee/payments/initiate", {
        studentId,
        amount,
        feeItemIds,
        notes: {
          feeItemIds: feeItemIds.join(","),
          studentName: studentData.name,
          className: studentData.class,
          section: studentData.section,
        },
      });

      if (!orderResponse.data?.orderId) {
        throw new Error("Failed to create payment order");
      }

      const { orderId, amount: orderAmount } = orderResponse.data;

      const options = {
        key: "rzp_test_iRgVqBj04lX5vr",
        amount: orderAmount,
        currency: "INR",
        name: "School Fee Payment",
        description: `Fee payment for ${studentData.name} (${studentData.class}-${studentData.section})`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Prepare verification data
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderAmount,
              orderId: orderId,
              feeItemIds: feeItemIds,
              studentId: studentId,
            };

            // Verify payment
            const verificationResponse = await axiosInstance.post(
              `/fee/payments/verify/${studentId}`,
              verificationData
            );

            if (verificationResponse.data.success) {
              // Optimistic UI updates
              const paidDate = new Date();

              // 1. Update fee items status
              setFeeItems((prevItems) =>
                prevItems.map((item) => ({
                  ...item,
                  isPaid: feeItemIds.includes(item._id) ? true : item.isPaid,
                  ...(feeItemIds.includes(item._id) && {
                    paidDate: paidDate.toISOString(),
                  }),
                }))
              );

              // 2. Add to payment history
              const newPayment = {
                id: verificationResponse.data.receiptId,
                _id: verificationResponse.data.receiptId, // For consistency
                date: paidDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
                amount: orderAmount / 100,
                type: "online",
                transactionId: response.razorpay_payment_id,
                receiptUrl: verificationResponse.data.receiptUrl,
                feeItems: feeItemIds,
                status: "completed",
              };

              setPastPayments((prev) => [newPayment, ...prev]);

              // 3. Force complete refresh from server
              await fetchStudentFeeData();

              // Show success with receipt download option
              alert(
                `Payment Successful!\n\n` +
                  `Amount: ₹${(orderAmount / 100).toLocaleString("en-IN")}\n` +
                  `Receipt ID: ${verificationResponse.data.receiptId}\n\n` +
                  `You can download the receipt from the Past Payments section.`
              );
            } else {
              throw new Error(
                verificationResponse.data.error || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error.response?.data || error
            );
            alert(
              `Payment completed but verification failed.\n\n` +
                `Please contact support with this ID: ${response.razorpay_payment_id}\n` +
                `Error: ${error.message}`
            );
          }
        },
        prefill: {
          name: studentData.name,
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("phone") || "",
        },
        notes: {
          studentId,
          studentName: studentData.name,
          feeItemIds: feeItemIds.join(","),
          class: `${studentData.class}-${studentData.section}`,
        },
        theme: {
          color: "#F97316",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        const error = response.error;
        console.error("Payment failed:", error);
        alert(
          `Payment Failed!\n\n` +
            `Reason: ${error.description}\n` +
            `Error Code: ${error.code}\n\n` +
            `Please try again or contact support.`
        );
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert(
        `Payment Error\n\n` +
          `${error.message}\n\n` +
          `Please try again or contact support if the problem persists.`
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStudentFeeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student fee details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 mt-18">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Receipt className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Fee Management
          </h1>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Name: {studentData.name || "Yogesj"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm md:text-base text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">
                    Unique ID:
                  </span>
                  <span className="text-gray-900">
                    STU-{studentData.uniqueId.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Class:</span>
                  <span className="text-gray-900">{studentData.class}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Batch:</span>
                  <span className="text-gray-900">{studentData.batch}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Fee Payment
              </h2>
            </div>

            {allFeesPaid ? (
              <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 font-semibold text-lg mb-2">
                  All fees have been paid
                </div>
                <p className="text-gray-600">
                  No payment due at this time. Check back later for new fee
                  payments.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-16">
                          Sr.
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Fee Type
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 w-32">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {feeItems
                        .filter((item) => !item.isPaid) // Only show unpaid items
                        .map((item, index) => (
                          <tr
                            key={item._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              {index + 1}.
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                              ₹{item.amount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      Total Due: ₹{calculateTotal().toLocaleString("en-IN")}
                    </div>
                    <button
                      onClick={handlePayNow}
                      disabled={paymentProcessing}
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paymentProcessing ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Past Payments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Past Payments:
              </h2>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Date
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {pastPayments.length > 0 ? (
                    pastPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                          {payment.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">
                          ₹
                          {payment.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {payment.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center font-mono">
                          {payment.transactionId}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No past payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeManagementPage;
