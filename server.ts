import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Dynamic server-side Gemini AI client initialization with user-agent telemetry and fallback key resolution
function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey =
    (customApiKey && customApiKey.trim() !== "" ? customApiKey.trim() : null) ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }

  try {
    return new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err: any) {
    console.warn("Failed to initialize GoogleGenAI client:", err?.message || err);
    return null;
  }
}

// Robust JSON extraction helper handling markdown code blocks, backticks, and extra wrapper text
function extractJson<T = any>(text: string): T {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text for JSON parsing");
  }

  let cleaned = text.trim();

  // Strip leading and trailing markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Attempt searching for outermost curly braces or square brackets
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");

    if (firstBrace !== -1 && lastBrace > firstBrace && (firstBracket === -1 || firstBrace < firstBracket)) {
      const candidate = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    } else if (firstBracket !== -1 && lastBracket > firstBracket) {
      const candidate = cleaned.substring(firstBracket, lastBracket + 1);
      return JSON.parse(candidate);
    }

    throw initialErr;
  }
}

// Resilient Gemini Generate Content with multi-model fallback and retry with jitter for temporary 503/429 spikes
async function generateContentWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  isJson: boolean = true
): Promise<string> {
  const models = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  const maxRetriesPerModel = 2;

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        const config: any = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (isJson) config.responseMimeType = "application/json";

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        // Safely extract generated text across response structures
        let text = "";
        if (typeof response.text === "string") {
          text = response.text.trim();
        } else if (response.candidates && response.candidates[0]?.content?.parts) {
          text = response.candidates[0].content.parts
            .map((p: any) => p.text || "")
            .join("")
            .trim();
        }

        if (text) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const status = err?.status || err?.code;
        const isTemporary =
          status === 503 ||
          status === 429 ||
          errMsg.includes("503") ||
          errMsg.includes("429") ||
          errMsg.includes("high demand") ||
          errMsg.includes("UNAVAILABLE");

        if (isTemporary && attempt < maxRetriesPerModel - 1) {
          const delay = 200 * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        break; // Proceed to next model in list
      }
    }
  }

  throw lastError || new Error("All Gemini model attempts encountered temporary high demand.");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Interactive Multi-Turn AI Copilot Chat Endpoint
app.post(["/api/ai/chat", "/api/ai/copilot-chat"], async (req, res) => {
  const { message, messages, endeavors, userEnergy, profile, apiKey } = req.body;
  const userPrompt = message || (Array.isArray(messages) && messages[messages.length - 1]?.text) || "";

  if (!userPrompt || typeof userPrompt !== "string") {
    return res.status(400).json({ error: "Missing prompt or message" });
  }

  const customKey = (req.headers["x-gemini-api-key"] as string) || (req.headers["x-api-key"] as string) || apiKey;
  const ai = getGeminiClient(customKey);

  const buildSmartFallbackReply = () => {
    const q = userPrompt.toLowerCase();
    const active = Array.isArray(endeavors) ? endeavors.filter((e: any) => e.status === "active") : [];
    const topGoal = active.find((e: any) => e.priority === "high") || active[0];

    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who are you")) {
      return `Hello! I'm your LifeOrbit Autonomous AI Strategist. I can help you plan your day, break down big goals into actionable micro-habits, design custom schedules, and keep your motivation high.\n\nCurrently you have ${active.length} active endeavor${active.length === 1 ? "" : "s"}${topGoal ? ` (including "${topGoal.title}")` : ""}. What would you like to focus on right now?`;
    }

    if (q.includes("schedule") || q.includes("plan") || q.includes("today") || q.includes("time")) {
      return `Here is a high-leverage strategy for your day based on ${userEnergy || "medium"} energy:\n\n1. **Deep Focus Block (45-60 min)**: Dedicate your best morning energy to ${topGoal ? `"${topGoal.title}"` : "your primary project"}.\n2. **Micro-Habit Anchor (15 min)**: Knock out quick recurring habits before lunch.\n3. **Recovery & Review**: Use the Timeline view to time-block your remaining hours.\n\nWould you like me to auto-generate time blocks for this in your Timeline?`;
    }

    if (q.includes("streak") || q.includes("habit") || q.includes("consistent") || q.includes("motivation")) {
      return `To maintain unwavering consistency with your habits:\n\n• **Lower the activation threshold**: On days with low energy, do just 2 minutes of the habit so you never break the streak.\n• **Anchor to existing triggers**: Stack your habit right after an existing daily routine (like morning coffee or after turning on your computer).\n• **Track daily**: Keep your LifeOrbit cards updated so you can visualize momentum!\n\nWhich specific habit are you finding toughest to stick with?`;
    }

    return `Here is my direct recommendation for **"${userPrompt}"**:\n\n• **Immediate Next Step**: ${topGoal ? `Take 1 small concrete step on "${topGoal.title}" right now.` : "Pick one key action and start a 25-minute focus session."}\n• **Energy Alignment**: Calibrated for ${userEnergy || "current"} energy — prioritize high-impact clarity over busywork.\n• **Momentum Rule**: 10 minutes of concentrated action beats 2 hours of overthinking.\n\nLet me know if you want me to break this down into atomic milestones, draft a schedule, or adjust your goals!`;
  };

  if (!ai) {
    return res.json({ reply: buildSmartFallbackReply(), text: buildSmartFallbackReply() });
  }

  try {
    const contextPrompt = `User Profile: ${JSON.stringify(profile || { role: "High Performer" })}
Current User Energy Level: ${userEnergy || "medium"}
Active User Endeavors/Goals: ${JSON.stringify(
      (endeavors || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        archetype: e.archetype,
        category: e.category,
        progress: `${e.currentValue}/${e.targetValue} ${e.unit}`,
        streak: e.streak,
        priority: e.priority,
      }))
    )}

Conversation History:
${Array.isArray(messages) ? messages.slice(-6).map((m: any) => `${m.role === "user" ? "User" : "Strategist"}: ${m.text}`).join("\n") : ""}

User's Latest Message: "${userPrompt}"`;

    const systemInstruction = `You are LifeOrbit's Autonomous AI Copilot, Performance Strategist, and Productivity Coach.
Your purpose is to actively listen to the user, answer their questions thoroughly and directly, and provide actionable, intelligent advice tailored to their specific endeavors, habits, energy level, and schedules.

Guidelines:
1. Actively listen and address whatever the user specifically asks (e.g. brainstorming, overcoming procrastination, optimizing a workout/study routine, troubleshooting consistency, time management).
2. Reference their actual endeavors, milestones, and energy levels naturally when relevant.
3. Be encouraging, sharp, concise, and structured (use bullet points and bold headers where appropriate).
4. Avoid generic repetitive fluff. Give fresh, thoughtful, bespoke responses.
5. End with a helpful, relevant follow-up or actionable prompt when fitting.`;

    const reply = await generateContentWithFallback(ai, contextPrompt, systemInstruction, false);
    return res.json({ reply, text: reply });
  } catch (error: any) {
    console.warn("AI Chat Fallback activated due to:", error?.message);
    const fallbackText = buildSmartFallbackReply();
    return res.json({ reply: fallbackText, text: fallbackText });
  }
});

// AI Natural Language Endeavor / Goal Parser
app.post("/api/ai/parse-endeavor", async (req, res) => {
  const { prompt, apiKey } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt" });
  }

  const customKey = (req.headers["x-gemini-api-key"] as string) || (req.headers["x-api-key"] as string) || apiKey;
  const ai = getGeminiClient(customKey);

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

    const parsed = extractJson(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Parse Fallback activated due to:", error?.message);
    return res.json(buildFallbackParsed());
  }
});

// AI Coach Advice & Strategy Optimizer (supports both /api/ai/coach-advice and /api/ai/coach)
app.post(["/api/ai/coach-advice", "/api/ai/coach"], async (req, res) => {
  const { endeavors, userEnergy, question, prompt, apiKey } = req.body;
  const userQuery = question || prompt || "Analyze my current progress, streaks, and prioritize my day.";

  const buildDynamicFallback = () => {
    const active = Array.isArray(endeavors) ? endeavors.filter((e: any) => e.status === "active") : [];
    const topGoal = active.find((e: any) => e.priority === "high") || active[0];
    const goalName = topGoal?.title || "Key Priority";

    return {
      headline: `Align Peak Energy With ${goalName}`,
      insights: [
        `Dedicate your first 35-minute block to "${goalName}" before opening communication apps.`,
        `Preserve active momentum by logging progress daily, even on low-energy days.`,
        `Chunk complex phases into 15-minute micro-sprints to eliminate startup friction.`
      ],
      actionRecommendation: `Launch a 25-minute focus session for "${goalName}" right now.`,
      motivationalQuote: "Momentum is built by showing up on the days you least feel like it.",
      text: `1. Dedicate your first 35-minute block to "${goalName}".\n2. Preserve active momentum by logging progress daily.\n3. Chunk complex phases into 15-minute micro-sprints.`
    };
  };

  const customKey = (req.headers["x-gemini-api-key"] as string) || (req.headers["x-api-key"] as string) || apiKey;
  const ai = getGeminiClient(customKey);
  if (!ai) {
    return res.json(buildDynamicFallback());
  }

  try {
    const promptContext = `User endeavors context: ${JSON.stringify(
      (endeavors || []).slice(0, 8).map((e: any) => ({
        title: e.title,
        archetype: e.archetype,
        category: e.category,
        progress: `${e.currentValue}/${e.targetValue} ${e.unit}`,
        streak: e.streak,
        priority: e.priority,
      }))
    )}
Current user energy level: ${userEnergy || "medium"}
User query / prompt: "${userQuery}"`;

    const systemInstruction = `You are LifeOrbit's AI Productivity Coach and Performance Strategist.
Actively evaluate the user's specific query and their active endeavors (meters, habits, milestones).
Return structured, highly concrete, actionable guidance formatted as JSON:
{
  "headline": "Punchy motivating 1-line tactical recommendation answering their query",
  "insights": ["Highly specific actionable insight 1", "Specific actionable insight 2", "Specific actionable insight 3"],
  "actionRecommendation": "The single most impactful next action to do right now",
  "motivationalQuote": "Inspiring relevant quote",
  "text": "Concise summary of recommendations"
}`;

    const jsonText = await generateContentWithFallback(ai, promptContext, systemInstruction, true);
    const parsed = extractJson(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Coach Fallback activated due to:", error?.message);
    return res.json(buildDynamicFallback());
  }
});

// AI Onboarding & Tailored Endeavor Generator
app.post("/api/ai/onboarding-setup", async (req, res) => {
  const { name, role, northStarMotto, selectedLifeSpheres, targetFocusHoursPerDay, apiKey } = req.body;

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

  const customKey = (req.headers["x-gemini-api-key"] as string) || (req.headers["x-api-key"] as string) || apiKey;
  const ai = getGeminiClient(customKey);
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

    const parsed = extractJson(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("AI Onboarding Fallback activated due to:", error?.message);
    return res.json(buildTailoredBlueprint());
  }
});

// AI Smart Schedule Generator (Time Blocking)
app.post("/api/ai/smart-schedule", async (req, res) => {
  const { endeavors, energyLevel, availableHours, apiKey } = req.body;

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

  const customKey = (req.headers["x-gemini-api-key"] as string) || (req.headers["x-api-key"] as string) || apiKey;
  const ai = getGeminiClient(customKey);
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

    const parsed = extractJson(jsonText);
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
