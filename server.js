const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ chatbotResponse: 'Message cannot be empty.' });
  }
  const url = process.env.URL
  const ASTRA_TOKEN = process.env.ASTRA_TOKEN;

  const payload = {
    input_value: message,
    output_type: "chat",
    input_type: "chat",
    tweaks: {
      "ChatInput-nhjm8": {},
      "ParseData-qYEnX": {},
      "Prompt-B6BIh": {},
      "SplitText-FnQ9O": {},
      "ChatOutput-kFLnr": {},
      "File-LJ2qt": {},
      "Google Generative AI Embeddings-BuZho": {},
      "Chroma-nuzKc": {},
      "Google Generative AI Embeddings-lTaTn": {},
      "Chroma-XiBEc": {},
      "GoogleGenerativeAIModel-wZizT": {}
    }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ASTRA_TOKEN}`, // Use the correct token
      },
    });

    const chatMessage =
      response.data.outputs[0]?.outputs[0]?.results?.message?.data?.text ||
      'No response from chatbot.';

    res.send({ chatbotResponse: chatMessage });
  } catch (error) {
    console.error("Error communicating with Langflow API:", error.response?.data || error.message);
    res.status(500).send({ chatbotResponse: 'Sorry, something went wrong!' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
