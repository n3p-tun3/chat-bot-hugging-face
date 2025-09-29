import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { InferenceClient } from "@huggingface/inference";

const app = express();

app.use(express.json());
app.use(express.static("public"));
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

const client = new InferenceClient(HF_TOKEN);

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body?.message;

    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    try {
        const chatCompletion = await client.chatCompletion({
            provider: "novita",
            model: "deepseek-ai/DeepSeek-V3.1-Terminus",
            messages: [{
                role: "user", content: userMessage,
            },],
        });

        const reply = chatCompletion.choices[0].message
        console.log(reply);
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));