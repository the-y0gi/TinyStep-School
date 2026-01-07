
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getStudentDetails,
  approveStudent,
  rejectStudents,
} from "../../services/adminAllAPI's";
import { toast } from "react-hot-toast";

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      const res = await getStudentDetails(id);
      if (res.data) {
        setStudent(res.data);
      } else {
        toast.error("Student data not found");
      }
    } catch (err) {
      console.error("Failed to load student", err);
      toast.error(
        err.response?.data?.message || "Failed to load student details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudent();
    } else {
      toast.error("No student ID provided");
    }
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveStudent([id]);
      toast.success("Student Approved ✅");
      fetchStudent(); // Refresh the data after approval
    } catch (err) {
      toast.error("Approval Failed ❌");
    }
  };

  const handleReject = async () => {
    try {
      await rejectStudents([id]);
      toast.success("Student Rejected ❌");
      fetchStudent(); // Refresh the data after rejection
    } catch (err) {
      toast.error("Rejection Failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Student Detail</h2>

      {/* Kid Info */}
      <section className="border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Kid Info</h3>
        <p>
          <b>Name:</b> {student.childName}
        </p>
        <p>
          <b>Date of Birth:</b> {new Date(student.dateOfBirth).toLocaleDateString()}
        </p>
        <p>
          <b>Gender:</b> {student.gender}
        </p>
        <p>
          <b>Grade:</b> {student.grade}
        </p>
        <p>
          <b>Academic Year:</b> {student.academicYear}
        </p>
        <p>
          <b>Blood Group:</b> {student.medicalInfo?.bloodGroup || "N/A"}
        </p>
      </section>

      {/* Parent Info */}
      <section className="border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Parent Info</h3>
        <p>
          <b>Parent Name:</b> {student.parentName}
        </p>
        <p>
          <b>Phone:</b> {student.phone}
        </p>
        <p>
          <b>Father's Name:</b> {student.parentDetails?.fatherName || "N/A"}
        </p>
        <p>
          <b>Mother's Name:</b> {student.parentDetails?.motherName || "N/A"}
        </p>
        <p>
          <b>Email:</b> {student.parentDetails?.email || "N/A"}
        </p>
        <p>
          <b>Address:</b> {student.parentDetails?.address || "N/A"}
        </p>
        <p>
          <b>Annual Income:</b> {student.annualIncome}
        </p>
      </section>

      {/* Uploaded Documents */}
      <section className="border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Uploaded Documents</h3>
        <div className="space-y-2">
          {student.documents?.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2"
            >
              <p>{doc.label}</p>
              <button
                className="text-blue-600 underline"
                onClick={() => setPreviewFile(doc.url)}
              >
                Preview
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Approve / Reject Buttons - Only show if status is pending */}
      {student.status === "pending" && (
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      )}

      {/* Status Indicator */}
      {student.status !== "pending" && (
        <div className={`p-3 rounded ${student.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          This application has been <b>{student.status}</b>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
              onClick={() => setPreviewFile(null)}
            >
              ✖
            </button>
            <h4 className="text-lg font-semibold mb-4">Document Preview</h4>

            {previewFile.endsWith(".pdf") ? (
              <embed
                src={previewFile}
                type="application/pdf"
                className="w-full h-[500px] rounded"
              />
            ) : (
              <img
                src={previewFile}
                alt="Preview"
                className="w-full max-h-[500px] object-contain rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x500?text=Unable+to+load+image";
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}