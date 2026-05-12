import express from 'express';
import runGraph from './ai/graph.ai.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get("/test-ai", async (req, res) => {
    try {
        const result = await runGraph("Write a function to reverse a string in JavaScript");

        console.log("🔥 RESULT:", JSON.stringify(result, null, 2)); // 👈 ADD THIS

        res.json(result);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
});



export default app;