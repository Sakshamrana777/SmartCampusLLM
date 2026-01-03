import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminPage() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold">🧑‍💼 Admin Analytics</h2>
        <p className="text-gray-500 mt-1">
          Logged in as: <b>{auth?.display_id}</b>
        </p>
      </div>

      <p className="text-gray-400">
        System-wide analytics and management tools.
      </p>
    </div>
  );
}
