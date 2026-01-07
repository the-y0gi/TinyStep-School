
export default function ActivityFeed({ activities = [] }) {  // Default empty array
  if (!activities || activities.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No recent activity found
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {activities.map((activity, index) => (
        <li key={index} className="flex items-start">
          <span className="bg-gray-100 p-2 rounded-full mr-3">🔔</span>
          <div>
            <p className="font-medium">{activity.message || 'Activity update'}</p>
            <p className="text-sm text-gray-500">
              {activity.timestamp 
                ? new Date(activity.timestamp).toLocaleString() 
                : 'Recent activity'}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}