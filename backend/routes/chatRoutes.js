const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Medication = require("../models/Medication");
const { protect } = require("../middleware/auth");

// ---------------------------
// Fetch Patient Medications
// ---------------------------
async function getPatientMedications(userId) {
  try {
    const meds = await Medication.find({ patient: userId });

    return meds.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      instructions: m.instructions,
      startDate: m.startDate,
      endDate: m.endDate,
      schedule: m.schedule,
    }));
  } catch (err) {
    console.error("❌ Medication fetch error:", err);
    return [];
  }
}

// ---------------------------
// Chatbot Route
// ---------------------------
router.post("/", protect, async (req, res) => {
  console.log("📥 Incoming chatbot request");

  try {
    const { message } = req.body;
    const user = req.user;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "The chatbot is not configured. Add OPENAI_API_KEY to the backend environment.",
      });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("👤 Logged-in user:", user._id);

    // Fetch medications
    const meds = await getPatientMedications(user._id);
    console.log(`💊 Found ${meds.length} medications for this user.`);

    // Format medication context
    const medicationContext =
      meds.length > 0
        ? meds
            .map(
              (m) => `
• ${m.name}
  - Dosage: ${m.dosage}
  - Frequency: ${m.frequency}
  - Start: ${m.startDate ? m.startDate.toDateString() : "N/A"}
  - End: ${m.endDate ? m.endDate.toDateString() : "N/A"}
  - Instructions: ${m.instructions || "None"}
`
            )
            .join("\n")
        : "This patient currently has no recorded medications.";

    console.log("🧠 Sending request to OpenAI...");

    // OpenAI request
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are MedAssist, an AI assistant integrated into a medication adherence tracker.
Your job is to assist patients with simple, conversational explanations about their medications.

PATIENT MEDICATION LIST:
-------------------------
${medicationContext}
-------------------------

RULES:
- Speak in clear, simple language.
- You MAY explain what a medication is generally used for.
- You MAY list common non-emergency side effects.
- You MUST NOT recommend dosage changes.
- You MUST NOT give emergency medical advice.
- If unsure, politely tell the patient to consult their provider.
- If asked about "when to take", use the frequency information.
- If asked about schedules, reference the provided schedule array.
- Keep answers friendly and supportive.
`
        },
        { role: "user", content: message },
      ],
    });

    console.log("🤖 OpenAI responded successfully.");

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Chatbot Error:", error);

    return res.status(500).json({
      error: "Internal chatbot error. Please try again.",
      details: error.message,
    });
  }
});

module.exports = router;
