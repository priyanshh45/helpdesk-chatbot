const { generateResponse } = require("../services/gemini");
const systemPrompt = require("../prompts/systemPrompt");

const chatController = async (req, res) => {
    try {
        const { message } = req.body;

        // Validate input
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        // Get AI response
        const reply = await generateResponse(message, systemPrompt);

        res.status(200).json({
            success: true,
            reply
        });

    } catch(error){
        console.error("Controller Error:", error);

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

module.exports = chatController;