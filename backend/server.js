import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("✅ Smart Mock AI Resume Backend Running");
});

app.post("/api/generate-summary", (req, res) => {
  const { name, role, skills, experience } = req.body || {};

  const expLevel =
    experience < 1 ? "Fresher" :
    experience < 4 ? "Mid-Level" : "Senior";

  const summary = `
${role || "Professional"} (${expLevel}) with ${experience || 0} years of experience.
Skilled in ${skills || "modern technologies"} with strong analytical and problem-solving abilities.
Proven ability to work in team environments and deliver high-quality solutions efficiently.
Highly motivated, detail-oriented, and passionate about continuous learning.
`;

  const experienceList = [
    {
      companyName: "Tech Solutions Pvt Ltd",
      role: role || "Software Developer",
      startDate: "2023",
      endDate: "2024",
      description: `Worked as a ${role || "developer"} focusing on ${skills || "web technologies"}.
Built real-world applications, improved performance, and fixed critical bugs.
Collaborated with cross-functional teams and followed Agile methodologies.`
    },
    {
      companyName: "Innovate Labs",
      role: role || "Junior Developer",
      startDate: "2022",
      endDate: "2023",
      description: `Developed frontend components and integrated REST APIs.
Participated in code reviews and improved application UI/UX quality.
Gained hands-on experience with real project workflows.`
    }
  ];

  res.json({
    summary,
    experience: experienceList
  });
});

app.listen(PORT, () => {
  console.log(`✅ Smart Mock AI Backend running at http://localhost:${PORT}`);
});
