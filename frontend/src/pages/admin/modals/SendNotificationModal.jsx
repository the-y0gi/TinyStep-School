import { useState } from 'react';

export default function SendNotificationModal({ isOpen, onClose, onSend }) {
  const [notification, setNotification] = useState({
    recipient: 'all',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(notification);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Send Notification</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Recipient</label>
            <select
              value={notification.recipient}
              onChange={(e) => setNotification({...notification, recipient: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Parents</option>
              <option value="nursery">Nursery Class</option>
              <option value="kg">KG Class</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Message</label>
            <textarea
              value={notification.message}
              onChange={(e) => setNotification({...notification, message: e.target.value})}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}