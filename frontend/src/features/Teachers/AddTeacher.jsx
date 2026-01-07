
import { teacherAPI } from "../../services/adminAllAPI's";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualifications: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teacherAPI.createTeacher(formData);
      alert("Teacher created successfully!");
      setFormData({
        name: "",
        email: "",
        qualifications: "",
        phone: "",
        password: "",
      });
      setShowPassword(false);
    } catch (error) {
      alert("Error creating teacher: " + error.response?.data?.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Teacher</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Qualifications"
          className="w-full p-2 mb-2 border rounded"
          value={formData.qualifications}
          onChange={(e) =>
            setFormData({ ...formData, qualifications: e.target.value })
          }
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 mb-2 border rounded"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded pr-10"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Teacher
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
