const ChatHistory = require("../models/ChatHistory");

async function saveMessage(sessionId, role, content) {

    let chat = await ChatHistory.findOne({ sessionId });

    if (!chat) {
        chat = new ChatHistory({
            sessionId,
            messages: []
        });
    }

    chat.messages.push({
        role,
        content
    });

    await chat.save();
}

async function getHistory(sessionId) {

    const chat = await ChatHistory.findOne({ sessionId });

    if (!chat) return [];

    return chat.messages;
}

module.exports = {
    saveMessage,
    getHistory
};