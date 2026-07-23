const fs = require("fs-extra");
const { createEmbedding } = require("./embedding");

// Cosine similarity
function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simple keyword score
function keywordScore(query, text) {
    const words = query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    const content = text.toLowerCase();

    let score = 0;

    for (const word of words) {
        if (content.includes(word)) {
            score++;
        }
    }

    return score;
}

async function searchKnowledge(query, topK = 3) {

    const database = await fs.readJson("./data/embeddings.json");

    const queryEmbedding = await createEmbedding(query);

    const scored = database.map(doc => {

        const semantic = cosineSimilarity(
            queryEmbedding,
            doc.embedding
        );

        const searchableText = `
        ${doc.title}
        ${doc.file}
        ${doc.category}
        ${doc.content}
        `;

        const keyword =
            keywordScore(query, searchableText) * 0.05;

        return {
            ...doc,
            score: semantic + keyword
        };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
}

module.exports = {
    searchKnowledge
};