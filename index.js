import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { InferenceClient } from "@huggingface/inference";

const app = express();

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'false');
    res.header('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

app.use(express.json());
app.use(express.static("public"));
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

const client = new InferenceClient(HF_TOKEN);

// Load café dataset for context
import fs from 'fs';
const dataset = JSON.parse(fs.readFileSync('dataset.json', 'utf8'));
const cafeContext = dataset.map(item => `Q: ${item.instruction}\nA: ${item.output}`).join('\n\n');

// Store conversation history in memory (session-based)
const conversations = new Map();

app.post("/api/chat", async (req, res) => {
    const { message: userMessage, sessionId = 'default' } = req.body;

    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    // Get or create conversation history for this session
    if (!conversations.has(sessionId)) {
        conversations.set(sessionId, []);
    }
    const history = conversations.get(sessionId);

    // Add user message to history
    history.push({ role: "user", content: userMessage });

    // Keep only last 10 messages to prevent token overflow
    const recentHistory = history.slice(-10);

    // Always add system message with café context to maintain identity
    const messagesWithContext = [
        {
            role: "system",
            content: `You are the official AI assistant for Cozy Beans Café, a coffee shop. You ONLY help with café-related questions and services.

IMPORTANT: You are NOT a general assistant. You work exclusively for Cozy Beans Café.

Here is your café knowledge base:
${cafeContext}

RULES:
- Always identify yourself as Cozy Beans Café's assistant
- Only answer questions about the café, coffee, food, services, hours, etc.
- If asked about anything unrelated to the café (other businesses, general topics, etc.), politely say: "I'm here to help with Cozy Beans Café questions only. How can I assist you with our coffee, food, or services?"
- Use the exact information from the knowledge base above
- Be warm, friendly, and café-focused in every response
- Never pretend to be anything other than a café assistant`
        },
        ...recentHistory
    ];

    try {
        const chatCompletion = await client.chatCompletion({
            provider: "novita",
            model: "deepseek-ai/DeepSeek-V3.1-Terminus",
            messages: messagesWithContext,
        });

        const reply = chatCompletion.choices[0].message;

        // Add assistant response to history
        history.push(reply);

        console.log(history);
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));