import Sidebar from "../admin/Sidebar"
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1  p-8 bg-slate-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
