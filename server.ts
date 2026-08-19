import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy server-side Gemini AI client initialization with User-Agent telemetry
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient Gemini Generate Content with Model Fallbacks (handles temporary 503/429 spikes)
async function generateContentWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  // Use models in order of current real-time throughput and availability
  const models = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-flash-latest"];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch {
      // Continue to next available model without throwing unhandled exceptions
      continue;
    }
  }

  throw new Error("All Gemini model attempts encountered temporary high demand.");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Natural Language Endeavor / Goal Parser
app.post("/api/ai/parse-endeavor", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt" });
  }

  const ai = getGeminiClient();

  // Intelligent deterministic builder for fallback / instant response
  const buildFallbackParsed = () => {
    const lower = prompt.toLowerCase();
    let archetype: "habit" | "meter" | "milestone" = "habit";
    let targetValue = 30;
    let startValue = 0;
    let unit = "days";
    let category = "personal";

    if (lower.includes("$") || lower.includes("dollar") || lower.includes("save") || lower.includes("invest") || lower.includes("earn")) {
      archetype = "meter";
      category = "finance";
      unit = "USD";
      const numMatch = prompt.match(/\d+[\d,]*/);
      targetValue = numMatch ? parseInt(numMatch[0].replace(/,/g, ""), 10) : 1000;
    } else if (lower.includes("read") || lower.includes("page") || lower.includes("book") || lower.includes("kg") || lower.includes("lbs") || lower.includes("mile") || lower.includes("km") || lower.includes("pushup") || lower.includes("hour")) {
      archetype = "meter";
      category = lower.includes("read") || lower.includes("book") ? "learning" : "health";
      const numMatch = prompt.match(/\d+/);
      targetValue = numMatch ? parseInt(numMatch[0], 10) : 50;
      unit = lower.includes("page") ? "pages" : lower.includes("book") ? "books" : lower.includes("km") ? "km" : lower.includes("lbs") ? "lbs" : "units";
    } else if (lower.includes("build") || lower.includes("launch") || lower.includes("create") || lower.includes("project") || lower.includes("saas") || lower.includes("app") || lower.includes("course") || lower.includes("startup")) {
      archetype = "milestone";
      category = "career";
      unit = "phases";
      targetValue = 100;
    }

    return {
      title: prompt.slice(0, 45),
      description: `Structured action plan for: ${prompt}`,
      archetype,
      category,
      targetValue,
      startValue,
      currentValue: startValue,
      unit,
      frequency: "daily",
      difficulty: "medium",
      milestones: archetype === "milestone" ? [
        { id: "m1", title: "Research & Requirements", completed: false, weight: 25 },
        { id: "m2", title: "Core MVP Build", completed: false, weight: 40 },
        { id: "m3", title: "Testing & Polishing", completed: false, weight: 20 },
        { id: "m4", title: "Launch & Metric Tracking", completed: false, weight: 15 },
      ] : [],
      suggestedTips: [
        "Break into 25-minute focused daily sprints.",
        "Track progress consistently every evening.",
        "Celebrate milestone achievements to maintain momentum."
      ]
    };
  };

  if (!ai) {
    return res.json(buildFallbackParsed());
  }

  try {
    const systemInstruction = `You are an expert Productivity Architect & Goal Planner.
Parse any user's natural language goal, habit, activity, or endeavor description into a structured JSON configuration.
Determine the most effective Activity Archetype:
- 'habit': Recurring binary daily/weekly habits or routines (e.g. Meditation, 7am workout, No Sugar, Journaling).
- 'meter': Quantifiable numerical targets with specific units (e.g. Save $5,000, Read 24 books, Bench press 200 lbs, Run 100km, Drink 2.5L water daily).
- 'milestone': Project with distinct chronological phases or sub-tasks (e.g. Launch a SaaS product, Learn Spanish B2, Renovate kitchen, Pass CFA Level 1).

Category must be one of: 'health', 'career', 'learning', 'finance', 'creative', 'mindfulness', 'personal'.

Return valid JSON with:
{
  "title": "Short punchy title (max 40 chars)",
  "description": "Clear actionable summary of the objective (1-2 sentences)",
  "archetype": "habit" | "meter" | "milestone",
  "category": "health" | "career" | "learning" | "finance" | "creative" | "mindfulness" | "personal",
  "targetValue": number,
  "startValue": number,
  "currentValue": number,
  "unit": string,
  "frequency": "daily" | "weekly" | "custom",
  "difficulty": "easy" | "medium" | "hard",
  "recommendedEnergy": "deep" | "medium" | "light",
  "milestones": [
    { "id": "m1", "title": "Milestone title", "completed": false, "weight": number }
  ],
  "suggestedTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const jsonText = await generateContentWithFallback(
      ai,
      `Parse this endeavor and create a complete planner configuration:\n"${prompt}"`,
      systemInstruction
    );

    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Parse Fallback activated due to:", error?.message);
    return res.json(buildFallbackParsed());
  }
});

// AI Coach Advice & Strategy Optimizer
app.post("/api/ai/coach-advice", async (req, res) => {
  const { endeavors, userEnergy, question } = req.body;

  const buildFallbackAdvice = () => ({
    headline: "Stay Consistent & Direct Peak Energy to Highest-Leverage Goals",
    insights: [
      "Tackle your most demanding deep work priority during your first high-energy focus block.",
      "Maintain streak continuity with a 5-minute micro-commitment even on packed days.",
      "Review milestones weekly to adjust pacing and celebrate incremental breakthroughs."
    ],
    actionRecommendation: "Schedule a 35-minute deep focus sprint right now for your primary endeavor.",
    motivationalQuote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
  });

  const ai = getGeminiClient();
  if (!ai) {
    return res.json(buildFallbackAdvice());
  }

  try {
    const promptContext = `User endeavors context: ${JSON.stringify(endeavors?.slice(0, 8) || [])}
Current user energy level: ${userEnergy || "medium"}
User question/focus: ${question || "How should I prioritize today and optimize my progress across all activities?"}`;

    const systemInstruction = `You are LifeOrbit's AI Productivity Coach and Performance Strategist.
Analyze the user's active endeavors (meters, habits, milestones), evaluate their completion velocity and streak status, and provide encouraging, highly actionable advice.
Return valid JSON format:
{
  "headline": "Punchy motivating 1-line tactical recommendation",
  "insights": ["Specific actionable insight 1", "Specific actionable insight 2", "Specific actionable insight 3"],
  "actionRecommendation": "The single most impactful next action to do right now",
  "motivationalQuote": "Inspiring relevant quote"
}`;

    const jsonText = await generateContentWithFallback(ai, promptContext, systemInstruction);
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Coach Fallback activated due to:", error?.message);
    return res.json(buildFallbackAdvice());
  }
});

// AI Onboarding & Tailored Endeavor Generator
app.post("/api/ai/onboarding-setup", async (req, res) => {
  const { name, role, northStarMotto, selectedLifeSpheres, targetFocusHoursPerDay } = req.body;

  // Build high-craft, role-tailored fallback endeavors so user experience is 100% reliable
  const buildTailoredBlueprint = () => {
    const userRole = role || "High Performer";
    const hours = targetFocusHoursPerDay || 4;
    const spheres: string[] = Array.isArray(selectedLifeSpheres) && selectedLifeSpheres.length > 0
      ? selectedLifeSpheres
      : ["career", "health", "learning"];

    const starterList: any[] = [];

    // Goal 1: Deep Work Habit
    starterList.push({
      title: `Daily Deep Work (${hours} Hours)`,
      description: `Dedicate ${hours} hours of high-leverage focus aligned with ${userRole} milestones.`,
      archetype: "habit",
      category: spheres.includes("career") ? "career" : spheres[0],
      targetValue: 30,
      startValue: 0,
      currentValue: 0,
      unit: "days",
      frequency: "daily",
      priority: "high",
      color: "#10b981",
      icon: "Zap",
      milestones: [
        { id: "m1", title: "7-Day Consistent Focus Streak", completed: false },
        { id: "m2", title: "21-Day Deep Habit Mastery", completed: false }
      ]
    });

    // Goal 2: Health / Conditioning Meter or Habit
    if (spheres.includes("health") || spheres.length <= 2) {
      starterList.push({
        title: "Physical Conditioning & Vitality",
        description: "Consistent cardio, hydration, and recovery routine to maintain peak cognitive stamina.",
        archetype: "habit",
        category: "health",
        targetValue: 20,
        startValue: 0,
        currentValue: 0,
        unit: "sessions",
        frequency: "weekly",
        priority: "medium",
        color: "#ef4444",
        icon: "Activity",
        milestones: [
          { id: "m1", title: "Complete 10 training sessions", completed: false },
          { id: "m2", title: "Establish consistent circadian sleep/wake rhythm", completed: false }
        ]
      });
    }

    // Goal 3: Milestone Project
    starterList.push({
      title: `${userRole.split(" ")[0]} Milestone Blueprint`,
      description: `Deliver landmark project: ${northStarMotto || "Long-term mastery and compounding gains"}.`,
      archetype: "milestone",
      category: spheres.find((s) => s !== "health") || "career",
      targetValue: 100,
      startValue: 0,
      currentValue: 0,
      unit: "%",
      frequency: "custom",
      priority: "high",
      color: "#6366f1",
      icon: "Target",
      milestones: [
        { id: "m1", title: "Phase 1: Architecture & Planning", completed: false, weight: 25 },
        { id: "m2", title: "Phase 2: Core Execution Sprint", completed: false, weight: 50 },
        { id: "m3", title: "Phase 3: Validation, Polish & Launch", completed: false, weight: 25 }
      ]
    });

    // Goal 4: Quantifiable Reading / Learning or Finance Meter
    if (spheres.includes("learning")) {
      starterList.push({
        title: "Intellectual Growth & Reading",
        description: "Absorb seminal industry texts, research papers, and technical books.",
        archetype: "meter",
        category: "learning",
        targetValue: 12,
        startValue: 0,
        currentValue: 0,
        unit: "books",
        frequency: "custom",
        priority: "medium",
        color: "#06b6d4",
        icon: "BookOpen",
        milestones: []
      });
    } else if (spheres.includes("finance")) {
      starterList.push({
        title: "Capital Growth & Wealth Reserve",
        description: "Target monthly investment and savings allocation.",
        archetype: "meter",
        category: "finance",
        targetValue: 5000,
        startValue: 0,
        currentValue: 0,
        unit: "USD",
        frequency: "custom",
        priority: "high",
        color: "#10b981",
        icon: "DollarSign",
        milestones: []
      });
    }

    return {
      welcomeMessage: `Welcome ${name || "Commander"}. Your personalized ${userRole} Command Center is architected and ready for execution.`,
      suggestedMotto: northStarMotto || "Compound daily momentum with uncompromising consistency.",
      tailoredEndeavors: starterList
    };
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.json(buildTailoredBlueprint());
  }

  try {
    const systemInstruction = `You are LifeOrbit's AI Life Architect and Onboarding Coach.
The user is setting up their personal life operating system. Given their profile:
- Name: ${name || "User"}
- Role / Identity Archetype: ${role || "High Performer"}
- North Star Motto / Vision: ${northStarMotto || "Daily growth"}
- Selected Focus Life Spheres: ${JSON.stringify(selectedLifeSpheres || ["career", "health", "learning"])}
- Target Daily Focus Hours: ${targetFocusHoursPerDay || 4}

Generate 3-4 highly tailored, inspirational, and actionable starter endeavors (a balanced mix of 'habit', 'meter', and 'milestone' archetypes) that directly fit their specific identity and goals.
Return valid JSON:
{
  "welcomeMessage": "Personalized 1-2 sentence welcome and mission statement",
  "suggestedMotto": "A refined, powerful personal motto",
  "tailoredEndeavors": [
    {
      "title": "Clear punchy title (max 40 chars)",
      "description": "Engaging description customized to their role",
      "archetype": "habit" | "meter" | "milestone",
      "category": "health" | "career" | "learning" | "finance" | "creative" | "mindfulness" | "personal",
      "targetValue": number,
      "startValue": number,
      "currentValue": 0,
      "unit": string,
      "frequency": "daily" | "weekly" | "custom",
      "priority": "high" | "medium",
      "color": "hex color code (e.g. #10b981, #6366f1, #f59e0b, #06b6d4, #ef4444)",
      "icon": "Lucide icon name (e.g. Sparkles, Zap, Activity, BookOpen, Cpu, DollarSign, Target, Compass)",
      "milestones": [
        { "id": "m1", "title": "Milestone step 1", "completed": false, "weight": 25 },
        { "id": "m2", "title": "Milestone step 2", "completed": false, "weight": 25 },
        { "id": "m3", "title": "Milestone step 3", "completed": false, "weight": 50 }
      ]
    }
  ]
}`;

    const jsonText = await generateContentWithFallback(
      ai,
      `Create personalized onboarding configuration and starter goals for ${name || "User"} (${role || "Achiever"})`,
      systemInstruction
    );

    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Onboarding Fallback activated due to:", error?.message);
    return res.json(buildTailoredBlueprint());
  }
});

// AI Smart Schedule Generator (Time Blocking)
app.post("/api/ai/smart-schedule", async (req, res) => {
  const { endeavors, energyLevel, availableHours } = req.body;

  const buildFallbackSchedule = () => {
    const hours = availableHours || 6;
    const blocks = [];
    let currentHour = 9;

    const activeEndeavors = Array.isArray(endeavors) ? endeavors.slice(0, 4) : [];
    if (activeEndeavors.length > 0) {
      for (let i = 0; i < activeEndeavors.length && i < 4; i++) {
        const item = activeEndeavors[i];
        const startH = currentHour < 10 ? `0${currentHour}:00` : `${currentHour}:00`;
        const endH = (currentHour + 1) < 10 ? `0${currentHour + 1}:00` : `${currentHour + 1}:00`;
        blocks.push({
          id: `block-${Date.now()}-${i}`,
          endeavorId: item.id,
          title: `${item.title} Focus Sprint`,
          startTime: startH,
          endTime: endH,
          energyLevel: i === 0 ? "deep" : "medium",
          completed: false,
          notes: "Focus with zero distractions."
        });
        currentHour += 2;
      }
    } else {
      blocks.push(
        {
          id: `block-${Date.now()}-1`,
          title: "Deep Work Sprint (High Leverage)",
          startTime: "09:00",
          endTime: "11:00",
          energyLevel: "deep",
          completed: false,
          notes: "Tackle primary strategic endeavor."
        },
        {
          id: `block-${Date.now()}-2`,
          title: "Habit & Consistency Anchor",
          startTime: "14:00",
          endTime: "15:00",
          energyLevel: "medium",
          completed: false,
          notes: "Progress checks and micro-tasks."
        }
      );
    }

    return {
      summary: `Optimized ${hours}-hour time-blocking plan calibrated for ${energyLevel || "medium"} energy.`,
      blocks
    };
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.json(buildFallbackSchedule());
  }

  try {
    const systemInstruction = `You are an expert AI Scheduler. Generate an optimal daily time-blocking schedule (between 08:00 and 21:00) that balances high-intensity deep work, habit consistency, and recovery.
Return valid JSON:
{
  "summary": "Brief 1-sentence schedule strategy summary",
  "blocks": [
    {
      "id": "string",
      "endeavorId": "string (matching one of user endeavors)",
      "title": "Clear block title",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "energyLevel": "deep" | "medium" | "light",
      "completed": false,
      "notes": "Actionable task focus notes"
    }
  ]
}`;

    const jsonText = await generateContentWithFallback(
      ai,
      `Generate daily schedule for endeavors: ${JSON.stringify(endeavors || [])}, energy: ${energyLevel || "medium"}, available hours: ${availableHours || 6}`,
      systemInstruction
    );

    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Schedule Fallback activated due to:", error?.message);
    return res.json(buildFallbackSchedule());
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`LifeOrbit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
