const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors'); // 🔹 Import CORS

const app = express();
app.use(express.json()); // Middleware to parse JSON request body
app.use(cors()); // 🔹 Enable CORS

// Together AI API details
const API_URL = 'https://api.together.xyz/v1/chat/completions';
const API_KEY = '5b8f4d11537babd52ba55ad7c9be6f9d77e8fe551dd8e40b7e4803b0636d4d6e'; // Replace with your actual API key

// Endpoint to generate content based on user input
app.post('/generate-content', async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ error: "Topic is required!" });
        }

        // Send request to Together AI API
        const response = await axios.post(API_URL, {
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [{ role: "user", content: `Write a 300-word blog post on: ${topic}` }]
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
        });

        const content = response.data.choices[0].message.content;
        console.log(`📝 AI-Generated Content for ${topic}:
${content}\n`);

        // Save content to a file
        const filePath = `./blogContent/content_${topic.replace(/\s+/g, '_')}.txt`;
        fs.writeFileSync(filePath, content);

        res.json({ message: "Content generated successfully!", topic, content, filePath });
    } catch (error) {
        console.error("Error generating content:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate content." });
    }
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
