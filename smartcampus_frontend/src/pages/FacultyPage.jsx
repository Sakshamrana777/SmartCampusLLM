import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function FacultyPage() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold">👨‍🏫 Faculty Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Logged in as: <b>{auth?.display_id}</b>
        </p>
      </div>

      {/* Rest unchanged */}
      <p className="text-gray-400">
        Department overview and student performance visible here.
      </p>
    </div>
  );
}
