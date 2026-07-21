const fs = require("fs-extra");

const { loadKnowledge } = require("./services/loader");
const { chunkDocuments } = require("./services/chunker");
const { createEmbedding } = require("./services/embedding");

(async () => {

    const docs = await loadKnowledge();

    const chunks = chunkDocuments(docs);

    console.log(`Processing ${chunks.length} chunks...`);

    const database = [];

    for (let i = 0; i < chunks.length; i++) {

        console.log(`Embedding ${i + 1}/${chunks.length}`);

        const vector = await createEmbedding(chunks[i].chunk);

        database.push({

            ...chunks[i],

            embedding: vector

        });

    }

    await fs.writeJson("./data/embeddings.json", database, {
        spaces: 2
    });

    console.log("Embeddings saved successfully!");

})();