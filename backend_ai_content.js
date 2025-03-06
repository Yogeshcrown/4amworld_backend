const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS package

const app = express();

// ✅ Allow Wix Frontend to Access Backend
app.use(cors({
    origin: ['https://www-4amworld-com.filesusr.com', 'https://4amworld.com'], // Add both Wix domain & your custom domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // Middleware to parse JSON request body

// Together AI API details
const API_URL = 'https://api.together.xyz/v1/chat/completions';
const API_KEY = '5b8f4d11537babd52ba55ad7c9be6f9d77e8fe551dd8e40b7e4803b0636d4d6e';

// Endpoint to generate content based on user input
app.post('/generate-content', async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ error: "Topic is required!" });
        }

        // Send request to AI model
        const response = await axios.post(API_URL, {
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [{ role: "user", content: `Write a 300-word blog post on: ${topic}` }]
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
        });

        const content = response.data.choices[0].message.content;
        res.json({ message: "Content generated successfully!", topic, content });
    } catch (error) {
        console.error("Error generating content:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate content." });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
