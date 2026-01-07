import { X, Download } from 'lucide-react';

export default function DocumentViewer({ documentUrl, documentType, studentName, onClose }) {
  const isImage = documentType === 'childPhoto';
  const fileName = `${studentName}_${documentType}.${isImage ? 'jpg' : 'pdf'}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">
            {fileName}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {isImage ? (
            <img 
              src={documentUrl} 
              alt={fileName}
              className="max-w-full max-h-[70vh] mx-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/document-error.png';
              }}
            />
          ) : (
            <iframe 
              src={`${documentUrl}#view=fitH`}
              title={fileName}
              className="w-full h-[70vh] border"
            />
          )}
        </div>
      </div>
    </div>
  );
}