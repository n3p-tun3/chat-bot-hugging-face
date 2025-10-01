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

    // Add system message with café context for new conversations
    const messagesWithContext = [];
    if (history.length <= 2) { // Only add context for new conversations
        messagesWithContext.push({
            role: "system",
            content: `You are a helpful assistant for Cozy Beans Café. Use this information to answer customer questions:

${cafeContext}

Always be friendly, helpful, and café-focused in your responses. If asked about something not related to the café, politely redirect the conversation back to how you can help with café-related questions.`
        });
    }
    messagesWithContext.push(...recentHistory);

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