const { searchKnowledge } = require("./search");
const { generateResponse } = require("./gemini");

async function askRAG(userQuestion) {
    // Retrieve top 3 most relevant documents
    const relevantDocs = await searchKnowledge(userQuestion, 3);

    console.log("\n===== Top Retrieved Documents =====");

    relevantDocs.forEach((doc, index) => {
        console.log(
            `${index + 1}. ${doc.file} | Score: ${doc.score.toFixed(3)}`
        );
    });

    // Build knowledge context
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

    // Build prompt
    const prompt = `
You are an AI-powered Enterprise IT Help Desk Assistant following ITIL and ITSM best practices.

You have access to an internal IT Knowledge Base.

=========================
IMPORTANT RULES
=========================

1. Answer ONLY using the information in the KNOWLEDGE BASE.
2. Never use your own knowledge.
3. Never invent troubleshooting steps.
4. Never recommend websites, software, or tools unless they appear in the knowledge base.
5. If the knowledge base contains the answer, DO NOT ask unnecessary follow-up questions.
6. If multiple documents are relevant, combine the information.
7. If the answer does not exist in the knowledge base, reply exactly:

"I could not find this information in the knowledge base."

=========================
KNOWLEDGE BASE
=========================

${context}

=========================
USER QUESTION
=========================

${userQuestion}

=========================
RESPONSE FORMAT
=========================

# 🛠 IT Help Desk Solution

## Issue Type

## Priority

## Department

## Description

## Possible Causes

## Resolution Steps
- Step 1
- Step 2
- Step 3

## Escalation

## Knowledge Source
(List the document names used)

Provide only the final answer.
`;

    const answer = await generateResponse(prompt);

    return {
        answer,
        sources: relevantDocs.map((doc) => ({
            file: doc.file,
            score: Number(doc.score.toFixed(3)),
        })),
    };
}

module.exports = {
    askRAG,
};