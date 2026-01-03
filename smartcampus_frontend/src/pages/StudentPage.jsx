import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function StudentPage() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          🎓 Welcome, {auth?.user_id}
        </h2>
        <p className="text-gray-500 mt-1">
          Here’s a quick overview of your academic progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPA */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600 text-2xl">
            📊
          </div>
          <div>
            <p className="text-gray-500 text-sm">Current GPA</p>
            <p className="text-3xl font-bold">8.4</p>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-green-100 text-green-600 text-2xl">
            🕒
          </div>
          <div>
            <p className="text-gray-500 text-sm">Attendance</p>
            <p className="text-3xl font-bold">92%</p>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-purple-100 text-purple-600 text-2xl">
            📚
          </div>
          <div>
            <p className="text-gray-500 text-sm">Subjects Enrolled</p>
            <p className="text-3xl font-bold">6</p>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            🧾 Subject-wise Performance
          </h3>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-3">Subject</th>
                <th className="py-3">GPA</th>
                <th className="py-3">Attendance</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">Engineering Mathematics</td>
                <td className="py-3 font-semibold">8.2</td>
                <td className="py-3">94%</td>
                <td className="py-3 text-green-600 font-medium">
                  ✔ Good
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">Operating Systems</td>
                <td className="py-3 font-semibold">8.6</td>
                <td className="py-3">90%</td>
                <td className="py-3 text-green-600 font-medium">
                  ✔ Good
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">DBMS</td>
                <td className="py-3 font-semibold">8.4</td>
                <td className="py-3">93%</td>
                <td className="py-3 text-green-600 font-medium">
                  ✔ Good
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3">Computer Networks</td>
                <td className="py-3 font-semibold">7.9</td>
                <td className="py-3">88%</td>
                <td className="py-3 text-yellow-600 font-medium">
                  ⚠ Needs Attention
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500">
            *Data shown is static for review. Live student-specific data will be fetched from backend APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
