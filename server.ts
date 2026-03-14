import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CheckUp Backend is running" });
  });

  // Mock AI Prediction Endpoint (Simulating the AI Layer)
  app.post("/api/ai/predict", (req, res) => {
    const { wearableData, medicalHistory } = req.body;
    // In a real app, this would call a Python microservice or Gemini
    // For now, we return a simulated prediction
    res.json({
      riskScore: 72,
      category: "Cardiovascular",
      insights: "Based on your declining sleep quality and rising resting heart rate, there is a moderate risk of hypertension.",
      recommendations: ["HbA1c Test", "Stress Management Session", "Cardiology Consultation"]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
