import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is not configured. AI features will be limited.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const model = genAI ? genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
}) : null;

export async function askEcoTwinAI(
    userMessage: string,
    score: number,
    level: number,
    stage: string,
    history: string
) {
    // Input validation
    if (!userMessage || typeof userMessage !== 'string') {
        throw new Error('Invalid user message');
    }

    if (userMessage.length > 500) {
        throw new Error('Message too long (max 500 characters)');
    }

    // Sanitize input
    const sanitizedMessage = userMessage.trim().slice(0, 500);

    if (!model || !genAI) {
        return "AI features are currently unavailable. Please check your API configuration.";
    }

    const prompt = `
You are EcoCoach, an AI Sustainability Mentor inside the EcoTwin platform.

User EcoTwin Profile:

Carbon Score: ${score}
Level: ${level}
Avatar Stage: ${stage}

Conversation History:
${history}

Latest User Message:
${sanitizedMessage}

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

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        // Validate response
        if (!response || typeof response !== 'string') {
            throw new Error('Invalid AI response');
        }

        return response.slice(0, 500); // Limit response length
    } catch (error) {
        console.error('AI API Error:', error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
}