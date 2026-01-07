export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value || 0}</p>
      </div>
    </div>
  );
}