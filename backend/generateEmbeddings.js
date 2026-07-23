const fs = require("fs-extra");

const { loadKnowledge } = require("./services/loader");
const { createEmbedding } = require("./services/embedding");

(async () => {

    const docs = await loadKnowledge();

    console.log(`Loaded ${docs.length} documents`);

    const database = [];

    for (let i = 0; i < docs.length; i++) {

        console.log(`Embedding ${i + 1}/${docs.length}`);

        const vector = await createEmbedding(docs[i].content);

        database.push({
            ...docs[i],
            embedding: vector
        });

    }

    await fs.ensureDir("./data");

    await fs.writeJson("./data/embeddings.json", database, {
        spaces: 2
    });

    console.log("Embeddings generated successfully!");

})();