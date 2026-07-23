const { askRAG } = require("../services/rag");
const {
    saveMessage,
    getHistory
} = require("../services/chatHistory");

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

        const { message, sessionId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        // Use provided sessionId or create a default one
        const currentSession = sessionId || "default-session";

        const userMessage = message.trim().toLowerCase();

        // Save user's message
        await saveMessage(currentSession, "user", message);

        // -------------------------
        // Greetings
        // -------------------------

        if (greetings.includes(userMessage)) {

            const reply = `👋 Hello! Welcome to the IT Help Desk.

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

How can I assist you today?`;

            await saveMessage(currentSession, "assistant", reply);

            return res.status(200).json({
                success: true,
                reply
            });

        }

        // -------------------------
        // Thanks
        // -------------------------

        if (thanks.includes(userMessage)) {

            const reply =
                "😊 You're welcome! If you need any more IT assistance, feel free to ask.";

            await saveMessage(currentSession, "assistant", reply);

            return res.status(200).json({
                success: true,
                reply
            });

        }

        // -------------------------
        // Goodbye
        // -------------------------

        if (bye.includes(userMessage)) {

            const reply =
                "👋 Thank you for using the IT Help Desk Assistant. Have a great day!";

            await saveMessage(currentSession, "assistant", reply);

            return res.status(200).json({
                success: true,
                reply
            });

        }

        // -------------------------
        // Get Previous Chat History
        // -------------------------

        const history = await getHistory(currentSession);

        console.log("Conversation History:");
        console.log(history);

        // -------------------------
        // RAG
        // -------------------------

        const result = await askRAG(message);

        // Save AI response
        await saveMessage(currentSession, "assistant", result.answer);

        return res.status(200).json({
            success: true,
            reply: result.answer,
            sources: result.sources
        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = chatController;