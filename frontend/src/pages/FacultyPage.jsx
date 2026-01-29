import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Icons
import {
  Users,
  GraduationCap,
  TrendingUp,
  Lightbulb,
  Calendar,
  Trophy,
  MapPin
} from "lucide-react";

export default function FacultyPage() {
  const { auth } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [insight, setInsight] = useState("");
  const [event, setEvent] = useState(null);
  const [sports, setSports] = useState(null);

  const API = "http://127.0.0.1:8000";

  // Teaching Insights
  const insights = [
    "Use real-world examples to simplify complex concepts.",
    "Encourage active participation through small group tasks.",
    "Provide weekly feedback to help students track progress.",
    "Use visual aids to reinforce conceptual understanding.",
    "Promote peer-learning to improve engagement.",
    "Start each class with a recap to boost retention."
  ];

  const getRotatedInsight = () => {
    const index = new Date().getDate() % insights.length;
    return insights[index];
  };

  useEffect(() => {
    if (!auth?.department) return;

    const dept = auth.department;

    // 1. Department Summary
    fetch(`${API}/faculty/${dept}/summary`)
      .then((res) => res.json())
      .then((data) => setSummary(data));

    // 2. Top Performing Students
    fetch(`${API}/faculty/${dept}/top-students`)
      .then((res) => res.json())
      .then((data) => setTopStudents(data.students || []));

    // 3. Insight
    setInsight(getRotatedInsight());

    // 4. Static Event
    setEvent({
      title: "Faculty Development Program",
      date: "15 Feb 2026",
      location: "Seminar Hall 2",
      description: "Workshop on modern teaching tools & techniques."
    });

    // 5. Static Sports
    setSports({
      title: "Annual Sports Meet 2026",
      date: "20 Feb",
      sports: ["Cricket", "Football", "Badminton"]
    });
  }, [auth]);

  return (
    <div className="space-y-10 animate-fade-in">

      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-bold flex items-center gap-3 text-foreground">
          <Users className="text-indigo-500 dark:text-indigo-400" size={36} />
          Faculty Dashboard
        </h2>

        <p className="text-muted-foreground mt-1">
          Department: <b>{auth?.department}</b>
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Students */}
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-indigo-500 dark:text-indigo-400" size={24} />
            <p className="text-muted-foreground text-sm">Total Students</p>
          </div>
          <p className="text-4xl font-bold text-foreground">
            {summary?.total_students ?? "..."}
          </p>
        </div>

        {/* Avg GPA */}
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-500 dark:text-green-400" size={24} />
            <p className="text-muted-foreground text-sm">Department Avg GPA</p>
          </div>
          <p className="text-4xl font-bold text-foreground">
            {summary?.avg_gpa ?? "..."}
          </p>
        </div>

        {/* Teaching Insight */}
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="text-yellow-500 dark:text-yellow-400" size={24} />
            <p className="text-muted-foreground text-sm">Teaching Insight</p>
          </div>
          <p className="text-md font-medium text-foreground mt-2">{insight}</p>
        </div>

      </div>

      {/* TOP STUDENTS TABLE */}
      <div className="rounded-xl shadow-lg border bg-card backdrop-blur-xl">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <GraduationCap className="text-indigo-500 dark:text-indigo-400" size={22} />
            Top 5 Performing Students
          </h3>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-muted-foreground border-b text-sm">
                <th className="py-3">Name</th>
                <th className="py-3">GPA</th>
                <th className="py-3">Marks</th>
                <th className="py-3">Absences</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {topStudents.map((s, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-muted transition"
                >
                  <td className="py-3 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 font-semibold text-indigo-600 dark:text-indigo-400">{s.gpa}</td>
                  <td className="py-3 text-foreground">{s.marks}</td>
                  <td className="py-3 text-foreground">{s.absences}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* FACULTY EVENT */}
      {event && (
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Calendar className="text-indigo-500 dark:text-indigo-400" size={22} />
            Faculty Event
          </h3>

          <p className="mt-2 font-bold text-foreground">{event.title}</p>
          <p className="text-muted-foreground">Date: {event.date}</p>

          <p className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin size={16} />
            {event.location}
          </p>

          <p className="mt-3 text-muted-foreground">{event.description}</p>
        </div>
      )}

      {/* SPORTS EVENT */}
      {sports && (
        <div className="rounded-xl shadow-lg p-6 border bg-card hover:shadow-xl transition backdrop-blur-xl">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Trophy className="text-yellow-500 dark:text-yellow-300" size={22} />
            Sports Meet
          </h3>

          <p className="mt-2 font-bold text-foreground">{sports.title}</p>
          <p className="text-muted-foreground">Date: {sports.date}</p>

          <p className="mt-2 text-muted-foreground">
            Sports: {sports.sports.join(", ")}
          </p>
        </div>
      )}

    </div>
  );
}
