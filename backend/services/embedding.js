const docs = await loadKnowledge();

console.log(`Processing ${docs.length} documents...`);

const database = [];

for (let i = 0; i < docs.length; i++) {

    console.log(`Embedding ${i + 1}/${docs.length}`);

    const vector = await createEmbedding(docs[i].content);

    database.push({
        ...docs[i],
        embedding: vector
    });
}