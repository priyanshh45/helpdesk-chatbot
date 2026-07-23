const { askRAG } = require("../services/rag");

const greetings = [
    "hi",
    "hii",
    "hiii",
    "hello",
    "hey",
    "hy",
    "heyy",
    "good morning",
    "good afternoon",
    "good evening",
    "good night"
];

const thanks = [
    "thanks",
    "thank you",
    "thankyou",
    "thx",
    "ty",
    "thanks a lot"
];

const bye = [
    "bye",
    "goodbye",
    "see you",
    "see ya",
    "exit",
    "quit"
];

const chatController = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const userMessage = message.trim().toLowerCase();

        // -------------------------
        // Greetings
        // -------------------------
        if (greetings.includes(userMessage)) {

            return res.status(200).json({
                success: true,
                reply: `👋 Hello! Welcome to the IT Help Desk.

I'm your AI IT Support Assistant.

I can help you with:

• Incident Management
• Service Requests
• Outlook Issues
• Printer Issues
• Password Reset
• Wi-Fi & Network Issues
• Slow PC
• Microsoft Teams
• Windows Problems
• Software Installation
• Laptop Requests
• ITIL & ITSM Concepts

How can I assist you today?`
            });

        }

        // -------------------------
        // Thanks
        // -------------------------
        if (thanks.includes(userMessage)) {

            return res.status(200).json({
                success: true,
                reply: "😊 You're welcome! If you need any more IT assistance, feel free to ask."
            });

        }

        // -------------------------
        // Goodbye
        // -------------------------
        if (bye.includes(userMessage)) {

            return res.status(200).json({
                success: true,
                reply: "👋 Thank you for using the IT Help Desk Assistant. Have a great day!"
            });

        }

        // -------------------------
        // RAG
        // -------------------------

        const result = await askRAG(message);

        return res.status(200).json({
            success: true,
            reply: result.answer,
            sources: result.sources
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = chatController;