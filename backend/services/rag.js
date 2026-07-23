const { searchKnowledge } = require("./search");
const { generateResponse } = require("./gemini");

async function askRAG(userQuestion) {

    // Retrieve the top 3 relevant documents
    const relevantDocs = await searchKnowledge(userQuestion, 3);

    console.log("\n===== Top Retrieved Documents =====");

    relevantDocs.forEach((doc, index) => {
        console.log(
            `${index + 1}. ${doc.file} | Score: ${doc.score.toFixed(3)}`
        );
    });

    // Build context
    const context = relevantDocs
        .map(
            (doc) => `
==================================================
Document: ${doc.file}
Category: ${doc.category}

${doc.content}
`
        )
        .join("\n");

    // Prompt
    const prompt = `
You are an AI-powered Enterprise IT Help Desk Assistant following ITIL and ITSM best practices.

You answer employee IT support questions using ONLY the provided Knowledge Base.

==================================================
IMPORTANT RULES
==================================================

1. Answer ONLY using the KNOWLEDGE BASE.

2. Never use your own knowledge.

3. Never invent troubleshooting steps.

4. Never recommend websites, software, tools, or solutions unless they appear in the knowledge base.

5. If the knowledge base already contains the solution, do NOT ask unnecessary follow-up questions.

6. Answer ONLY the user's specific question.

7. Ignore retrieved documents that are not directly related to the user's request.

8. Do NOT combine multiple SOPs unless the user explicitly asks for them.

9. If a field (Priority, Department, Escalation) is not mentioned in the knowledge base, write:
"Not specified in the knowledge base."

10. If the answer cannot be found in the knowledge base, reply exactly:

"I could not find this information in the knowledge base."

==================================================
KNOWLEDGE BASE
==================================================

${context}

==================================================
USER QUESTION
==================================================

${userQuestion}

==================================================
RESPONSE FORMAT
==================================================

# 🛠 IT Help Desk Solution

## Issue Type

## Priority

## Department

## Description

## Possible Causes

## Resolution Steps

1.
2.
3.

## Escalation

## Knowledge Source

(List only the document(s) actually used.)

Return only the final answer.
`;

    const answer = await generateResponse(prompt);

    return {
        answer,
        sources: relevantDocs.map(doc => ({
            file: doc.file,
            score: Number(doc.score.toFixed(3))
        }))
    };
}

module.exports = {
    askRAG
};