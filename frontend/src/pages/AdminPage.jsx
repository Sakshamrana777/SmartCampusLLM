import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Icons
import {
  Users,
  UserCheck,
  Trophy,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const { auth } = useContext(AuthContext);

  const [stats, setStats] = useState({ students: 0, faculty: 0 });
  const [topStudents, setTopStudents] = useState([]);
  const [topFaculty, setTopFaculty] = useState([]);
  const [event, setEvent] = useState(null);
  const [sports, setSports] = useState(null);

  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    // Stats
    fetch(`${API}/admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data));

    // Top Students
    fetch(`${API}/admin/top-students`)
      .then((res) => res.json())
      .then((data) => setTopStudents(data.students || []));

    // Top Faculty
    fetch(`${API}/admin/top-faculty`)
      .then((res) => res.json())
      .then((data) => setTopFaculty(data.faculty || []));

    // Static Events
    setEvent({
      title: "University Technology Summit",
      date: "20 March 2026",
      location: "Main Auditorium",
      description:
        "A combined event showcasing advancements in AI, robotics & education.",
    });

    setSports({
      title: "Annual Sports Meet 2026",
      date: "20 Feb",
      sports: ["Cricket", "Football", "Badminton", "Table Tennis"],
    });
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">

      {/* HEADER */}
      <div className="space-y-1 mb-6">
        <h2 className="text-4xl font-bold flex items-center gap-3 text-foreground">
          <Building2 className="text-indigo-500 dark:text-indigo-400" size={36} />
          Admin Dashboard
        </h2>

        {/* ADMIN BADGE */}
        <div className="flex items-center gap-3 mt-1">
          <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-card text-indigo-600 border-indigo-300 dark:border-indigo-700 dark:text-indigo-300">
            ADMINISTRATOR ACCESS ENABLED
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Students */}
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-indigo-500 dark:text-indigo-400" size={24} />
            <p className="text-muted-foreground text-sm">Total Students</p>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.students}</p>
        </div>

        {/* Total Faculty */}
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="text-green-500 dark:text-green-400" size={24} />
            <p className="text-muted-foreground text-sm">Total Faculty</p>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.faculty}</p>
        </div>

        {/* Insight */}
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-yellow-500 dark:text-yellow-300" size={24} />
            <p className="text-muted-foreground text-sm">Insight</p>
          </div>
          <p className="text-md mt-2 text-foreground">
            Admin insights help track performance trends across the university.
          </p>
        </div>
      </div>

      {/* TOP STUDENTS */}
      <div className="rounded-xl shadow-lg border bg-card backdrop-blur-xl">
        <div className="p-6 border-b flex items-center gap-2">
          <GraduationCap className="text-indigo-500 dark:text-indigo-400" size={22} />
          <h3 className="text-xl font-semibold text-foreground">
            Top 5 Students (All Departments)
          </h3>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-muted-foreground border-b text-sm">
                <th className="py-3">Name</th>
                <th className="py-3">Department</th>
                <th className="py-3">GPA</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {topStudents.map((s, i) => (
                <tr key={i} className="border-b hover:bg-muted transition">
                  <td className="py-3 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 text-foreground">{s.department}</td>
                  <td className="py-3 font-semibold text-indigo-600 dark:text-indigo-300">
                    {s.gpa}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP FACULTY */}
      <div className="rounded-xl shadow-lg border bg-card backdrop-blur-xl">
        <div className="p-6 border-b flex items-center gap-2">
          <Trophy className="text-yellow-500 dark:text-yellow-300" size={22} />
          <h3 className="text-xl font-semibold text-foreground">
            Top 5 Faculty (Performance Score)
          </h3>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-muted-foreground border-b text-sm">
                <th className="py-3">Faculty</th>
                <th className="py-3">Department</th>
                <th className="py-3">Designation</th>
                <th className="py-3">Score</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {topFaculty.map((f, i) => (
                <tr key={i} className="border-b hover:bg-muted transition">
                  <td className="py-3 font-medium text-foreground">{f.lecturer_id}</td>
                  <td className="py-3 text-foreground">{f.department}</td>
                  <td className="py-3 text-foreground">{f.designation}</td>
                  <td className="py-3 font-semibold text-indigo-600 dark:text-indigo-300">
                    {f.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVENT */}
      {event && (
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Calendar className="text-indigo-500 dark:text-indigo-400" size={22} />
            Upcoming Event
          </h3>

          <p className="font-bold mt-2 text-foreground">{event.title}</p>
          <p className="text-muted-foreground">Date: {event.date}</p>

          <p className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin size={16} />
            {event.location}
          </p>

          <p className="mt-3 text-muted-foreground">{event.description}</p>
        </div>
      )}

      {/* SPORTS */}
      {sports && (
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Trophy className="text-yellow-500 dark:text-yellow-300" size={22} />
            Sports Meet
          </h3>

          <p className="font-bold mt-2 text-foreground">{sports.title}</p>
          <p className="text-muted-foreground">Date: {sports.date}</p>

          <p className="mt-2 text-muted-foreground">
            Sports: {sports.sports.join(", ")}
          </p>
        </div>
      )}

    </div>
  );
}
