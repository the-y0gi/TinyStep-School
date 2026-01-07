import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, Mail, FileText, User, Calendar, Home, 
  School, Users, Briefcase, DollarSign, Droplet, 
  Ruler, Scale, HeartPulse, ArrowLeft, Download,
  Image as ImageIcon
} from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';
import Loader from '../../components/Loader';

import DocumentViewer from '../../pages/admin/DocumentViewer';

export default function StudentProfilePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/students/details/${studentId}`);
        setStudent(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load student data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Handle document download
  const handleDownload = async (docType) => {
    try {
      const response = await axiosInstance.get(
        `/admin/students/${studentId}/documents/${docType}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${student.childName}_${docType}.${response.headers['content-type'].includes('pdf') ? 'pdf' : 'jpg'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download document');
      console.error('Download error:', err);
    }
  };

  if (loading) return <Loader />;
  if (!student) return <div>No student data found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" /> Back to Students
        </button>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          {student.status.toUpperCase()}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              {student.documents?.childPhoto ? (
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                  <img 
                    src={`${axiosInstance.defaults.baseURL}${student.documents.childPhoto}`}
                    alt={student.childName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-child.png';
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.childName}</h1>
              <div className="flex flex-wrap items-center mt-2">
                <div className="flex items-center mr-4">
                  <School className="w-4 h-4 mr-1" />
                  <span>{student.grade.toUpperCase()}</span>
                </div>
                <div className="flex items-center mr-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Parent: {student.parentName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<Calendar />} label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
                <InfoItem icon={<Droplet />} label="Blood Group" value={student.bloodGroup || 'Not specified'} />
                <InfoItem icon={<Ruler />} label="Height" value={student.height ? `${student.height} cm` : 'Not specified'} />
                <InfoItem icon={<Scale />} label="Weight" value={student.weight ? `${student.weight} kg` : 'Not specified'} />
                <InfoItem icon={<HeartPulse />} label="Medical Info" value={student.medicalInfo || 'No medical conditions'} spanFull />
              </div>
            </div>

            {/* Family Information Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-blue-500" />
                Family Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<User />} label="Father" value={student.fatherName} />
                <InfoItem icon={<Briefcase />} label="Father's Occupation" value={student.fatherOccupation || 'Not specified'} />
                <InfoItem icon={<User />} label="Mother" value={student.motherName} />
                <InfoItem icon={<Briefcase />} label="Mother's Occupation" value={student.motherOccupation || 'Not specified'} />
                <InfoItem icon={<DollarSign />} label="Annual Income" value={getIncomeRange(student.annualIncome)} />
                <InfoItem icon={<Phone />} label="Primary Contact" value={student.phone} />
                <InfoItem icon={<Phone />} label="Alternate Contact" value={student.alternatePhone || 'Not specified'} />
                <InfoItem icon={<Phone />} label="Emergency Contact" value={student.emergencyContact} />
              </div>
              <div className="mt-4">
                <InfoItem icon={<MapPin />} label="Address" value={student.address} spanFull />
              </div>
            </div>
          </div>

          {/* Right Column - Documents */}
          <div className="space-y-6">
            {/* Documents Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Documents
              </h2>
              <div className="space-y-4">
                <DocumentCard 
                  title="Birth Certificate"
                  docType="birthCertificate"
                  student={student}
                  onView={() => setActiveDoc('birthCertificate')}
                  onDownload={handleDownload}
                />
                <DocumentCard 
                  title="Child Photo"
                  docType="childPhoto"
                  student={student}
                  onView={() => setActiveDoc('childPhoto')}
                  onDownload={handleDownload}
                />
                <DocumentCard 
                  title="Child Aadhar"
                  docType="childAadhar"
                  student={student}
                  onView={() => setActiveDoc('childAadhar')}
                  onDownload={handleDownload}
                />
                <DocumentCard 
                  title="Parent Aadhar"
                  docType="parentAadhar"
                  student={student}
                  onView={() => setActiveDoc('parentAadhar')}
                  onDownload={handleDownload}
                />
                <DocumentCard 
                  title="Address Proof"
                  docType="addressProof"
                  student={student}
                  onView={() => setActiveDoc('addressProof')}
                  onDownload={handleDownload}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Parents
                </button>
                <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {activeDoc && student.documents?.[activeDoc] && (
        <DocumentViewer
          documentUrl={`${axiosInstance.defaults.baseURL}${student.documents[activeDoc]}`}
          documentType={activeDoc}
          studentName={student.childName}
          onClose={() => setActiveDoc(null)}
        />
      )}
    </div>
  );
}

// Helper Components
function InfoItem({ icon, label, value, spanFull = false }) {
  return (
    <div className={spanFull ? 'md:col-span-2' : ''}>
      <div className="flex items-start">
        <span className="text-gray-500 mr-2 mt-1">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ title, docType, student, onView, onDownload }) {
  const hasDocument = !!student.documents?.[docType];
  const isImage = docType === 'childPhoto';

  return (
    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        {hasDocument && (
          <div className="flex space-x-2">
            <button 
              onClick={() => onView()}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDownload(docType)}
              className="text-green-600 hover:text-green-800 p-1"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {hasDocument ? (
        <div className="flex items-center text-sm text-gray-600">
          {isImage ? (
            <ImageIcon className="w-4 h-4 mr-1" />
          ) : (
            <FileText className="w-4 h-4 mr-1" />
          )}
          <span>{isImage ? 'Image' : 'PDF'} Document</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Not uploaded</p>
      )}
    </div>
  );
}

// Helper function
function getIncomeRange(value) {
  const ranges = {
    'below-2lakh': 'Below ₹2 Lakhs',
    '2-5lakh': '₹2-5 Lakhs',
    '5-10lakh': '₹5-10 Lakhs',
    '10-20lakh': '₹10-20 Lakhs',
    'above-20lakh': 'Above ₹20 Lakhs'
  };
  return ranges[value] || 'Not specified';
}