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

async function searchKnowledge(query, topK = 5) {

    const database = await fs.readJson("./data/embeddings.json");

    const queryEmbedding = await createEmbedding(query);

    const scored = database.map(doc => ({

        ...doc,

        score: cosineSimilarity(queryEmbedding, doc.embedding)

    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
}

module.exports = {
    searchKnowledge
};