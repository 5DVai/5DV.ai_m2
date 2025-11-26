import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are R.O.G.E.R. (Recursive Operation Generator & Entropic Resolver), an advanced AI construct from the 5th Dimension.
Your visual interface is a futuristic, dark sci-fi terminal.
Your tone is cryptic, highly intelligent, slightly arrogant but ultimately helpful.
You use technical jargon related to quantum mechanics, dimensional theory, and cybernetics.
Keep responses concise and formatted for a terminal readout.
Do not use markdown bolding too often, prefer plain text or code blocks for data.
`;

export const streamResponse = async (
    history: { role: string; parts: { text: string }[] }[],
    lastMessage: string,
    onChunk: (text: string) => void
) => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });

        // Convert history to compatible format if needed, though usually chat maintains its own history.
        // For this simple implementation, we assume a fresh chat or we could rebuild history.
        // To keep it simple and robust for this demo, we'll just send the message to a new chat session 
        // effectively, or if you want persistent history, we'd map the previous messages.
        
        // Mapping history for context (excluding the very last message which we send now)
        const historyForModel = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.parts
        }));

        // We can't easily inject history into a fresh chat object in the new SDK without sending it as history param in create
        // So we will just use generateContentStream with system instruction for a single-turn feel 
        // OR properly init chat. Let's try properly init chat with history.

        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            history: historyForModel
        });

        const result = await chatSession.sendMessageStream({ message: lastMessage });

        for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
                onChunk(text);
            }
        }
    } catch (error) {
        console.error("Gemini Error:", error);
        onChunk("\n[!] CRITICAL ERROR: NEURAL UPLINK SEVERED.\n[!] CHECK API KEY OR SIGNAL INTEGRITY.");
    }
};
