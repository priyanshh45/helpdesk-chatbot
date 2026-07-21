const { searchKnowledge } = require("./search");
const { generateResponse } = require("./gemini");

async function askRAG(userQuestion) {

    const relevantDocs = await searchKnowledge(userQuestion, 5);

    const context = relevantDocs
        .map(doc => `
Source: ${doc.file}

${doc.chunk}
`)
        .join("\n-------------------------\n");

    const prompt = `
You are an AI IT Help Desk Assistant.

Answer ONLY using the knowledge provided below.

If the answer is not found, politely say that the knowledge base does not contain that information.

Always answer using this format:

Issue Type:
Priority:
Department:
Possible Causes:
Resolution:
Escalation:
Reference:

Knowledge:
${context}

User Question:
${userQuestion}
`;

    const answer = await generateResponse(prompt);

    return {
        answer,
        sources: relevantDocs.map(doc => doc.file)
    };
}

module.exports = {
    askRAG
};