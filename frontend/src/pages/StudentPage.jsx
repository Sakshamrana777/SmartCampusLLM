import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Icons
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Calendar,
  Trophy,
  MapPin,
} from "lucide-react";

export default function StudentPage() {
  const { auth } = useContext(AuthContext);

  const [gpa, setGpa] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [tip, setTip] = useState("");
  const [event, setEvent] = useState(null);
  const [sports, setSports] = useState(null);

  const API = "http://127.0.0.1:8000";

  const tips = [
    "Revise your notes every weekend to strengthen memory.",
    "Solve previous year papers to identify weak areas.",
    "Study in short focused sessions instead of long hours.",
    "Practice active recall instead of only reading notes.",
    "Teach the concept to a friend — it forces deep understanding.",
    "Take small breaks to stay focused and avoid burnout.",
  ];

  const getRotatedTip = () => {
    const index = new Date().getDate() % tips.length;
    return tips[index];
  };

  useEffect(() => {
    if (!auth?.user_id) return;

    // GPA
    fetch(`${API}/student/${auth.user_id}/gpa`)
      .then((res) => res.json())
      .then((data) => setGpa(data.overall_gpa ?? null));

    // Subjects
    fetch(`${API}/student/${auth.user_id}/subjects`)
      .then((res) => res.json())
      .then((data) =>
        setSubjects(Array.isArray(data.subjects) ? data.subjects : [])
      );

    // Tip
    setTip(getRotatedTip());

    setEvent({
      title: "AI & Tech Expo 2026",
      date: "14 Feb",
      location: "Auditorium",
      description: "Explore robotics, VR, AI demos & workshops.",
    });

    setSports({
      title: "Annual Sports Meet 2026",
      date: "20 Feb",
      sports: ["Cricket", "Football", "Badminton"],
    });
  }, [auth]);

  return (
    <div className="space-y-10 animate-fade-in text-foreground">

      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-bold flex items-center gap-3">
          <GraduationCap size={36} className="text-indigo-600" />
          Welcome, {auth?.user_id}
        </h2>
        <p className="text-muted-foreground mt-1">
          Here’s your academic overview
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* GPA CARD */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-border 
                        hover:shadow-xl transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="text-indigo-600" size={24} />
            <p className="text-sm text-muted-foreground">Current GPA</p>
          </div>
          <p className="text-4xl font-bold">{gpa ?? "..."}</p>
        </div>

        {/* TIP CARD */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-border
                        hover:shadow-xl transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb
              className="text-yellow-500 dark:text-yellow-300"
              size={24}
            />
            <p className="text-sm text-muted-foreground">Tip of the Day</p>
          </div>
          <p className="text-md font-medium">{tip}</p>
        </div>

        {/* SUBJECTS CARD */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-border
                        hover:shadow-xl transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
              <BookOpen size={28} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Subjects Enrolled</p>
              <p className="text-4xl font-bold">{subjects.length}</p>
            </div>
          </div>

          <ul className="mt-4 text-sm space-y-1 text-foreground/80">
            {subjects.map((subj, index) => (
              <li key={index}>• {subj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* UNIVERSITY EVENT */}
      {event && (
        <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-border
                        hover:shadow-xl transition-colors">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="text-indigo-600" size={22} />
            University Event
          </h3>

          <p className="mt-2 font-bold">{event.title}</p>
          <p className="text-muted-foreground">Date: {event.date}</p>

          <p className="flex items-center gap-2 text-foreground mt-1">
            <MapPin size={16} />
            {event.location}
          </p>

          <p className="mt-3 text-muted-foreground">{event.description}</p>
        </div>
      )}

      {/* SPORTS SECTION */}
      {sports && (
        <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-border
                        hover:shadow-xl transition-colors">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="text-yellow-500 dark:text-yellow-300" size={22} />
            Sports Meet
          </h3>

          <p className="font-bold mt-1">{sports.title}</p>
          <p className="text-muted-foreground">Date: {sports.date}</p>

          <p className="mt-2 text-foreground">
            Sports: {sports.sports.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
