import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export async function askEcoTwinAI(
    userMessage: string,
    score: number,
    level: number,
    stage: string,
    history: string
) {
    const prompt = `
You are EcoCoach, an AI Sustainability Mentor inside the EcoTwin platform.

User EcoTwin Profile:

Carbon Score: ${score}
Level: ${level}
Avatar Stage: ${stage}

Conversation History:
${history}

Latest User Message:
${userMessage}

Rules:

- Be conversational.
- Act like a sustainability mentor.
- Ask ONE question at a time.
- Maximum 50 words.
- Don't write long paragraphs.
- Don't use markdown.
- Give practical suggestions.
- Remember previous messages.
- Help user improve EcoTwin score.
- Sound like ChatGPT/WhatsApp style chatting.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
}