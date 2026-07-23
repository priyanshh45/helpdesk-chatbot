const { askRAG } = require("../services/rag");

const chatController = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        // Use RAG instead of calling Gemini directly
        const result = await askRAG(message);

        res.status(200).json({
            success: true,
            reply: result.answer,
            sources: result.sources
        });

    } catch (error) {

        console.error("Controller Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = chatController;