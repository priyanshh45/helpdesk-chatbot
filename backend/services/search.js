const fs = require("fs-extra");
const { createEmbedding } = require("./embedding");

// ------------------------------
// Cosine Similarity
// ------------------------------

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

// ------------------------------
// Keyword Score
// ------------------------------

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

// ------------------------------
// Search
// ------------------------------

async function searchKnowledge(query, topK = 3) {

    const database = await fs.readJson("./data/embeddings.json");

    const queryEmbedding = await createEmbedding(query);

    const queryLower = query.toLowerCase();

    const scored = database.map(doc => {

        // Semantic similarity
        const semantic =
            cosineSimilarity(queryEmbedding, doc.embedding);

        // Build searchable text
        const searchableText = `
${doc.title}
${doc.file}
${doc.category}
${(doc.tags || []).join(" ")}
${doc.content}
`;

        // Keyword score
        const keyword =
            keywordScore(query, searchableText) * 0.05;

        // File name boost
        let filenameBoost = 0;

        if (doc.file.toLowerCase().includes(queryLower))
            filenameBoost += 0.30;

        // Title boost
        let titleBoost = 0;

        if (doc.title.toLowerCase().includes(queryLower))
            titleBoost += 0.25;

        // Category boost
        let categoryBoost = 0;

        if (
            doc.category &&
            queryLower.includes(doc.category.toLowerCase())
        ) {
            categoryBoost += 0.15;
        }

        // Tag boost
        let tagBoost = 0;

        if (doc.tags) {

            for (const tag of doc.tags) {

                if (
                    queryLower.includes(tag.toLowerCase())
                ) {
                    tagBoost += 0.20;
                }

            }

        }

        const score =
            semantic +
            keyword +
            filenameBoost +
            titleBoost +
            categoryBoost +
            tagBoost;

        return {
            ...doc,
            score
        };

    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);

}

module.exports = {
    searchKnowledge
};