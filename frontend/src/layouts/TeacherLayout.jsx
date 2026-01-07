import Sidebar from "../pages/teacher/Sidebar";
import { Outlet } from "react-router-dom";

const TeacherLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1  bg-white min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
