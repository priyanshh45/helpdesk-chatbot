const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


async function generateResponse(userMessage) {

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: userMessage
        });

        return response.text;

    } catch(error) {

        console.log("Gemini Error FULL:", JSON.stringify(error, null, 2));

        throw error;

    }
}


module.exports = { generateResponse };