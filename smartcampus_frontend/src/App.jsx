import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import StudentPage from "./pages/StudentPage";
import FacultyPage from "./pages/FacultyPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <Login />;
  }

  return (
    <Layout>
      {auth.role === "student" && <StudentPage />}
      {auth.role === "faculty" && <FacultyPage />}
      {auth.role === "admin" && <AdminPage />}
    </Layout>
  );
}
