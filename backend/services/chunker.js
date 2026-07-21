function chunkDocuments(documents, chunkSize = 350) {
  const chunks = [];

  documents.forEach((doc) => {
    const words = doc.content.split(/\s+/);

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ");

      chunks.push({
        title: doc.title,
        category: doc.category,
        tags: doc.tags,
        file: doc.file,
        chunk,
      });
    }
  });

  return chunks;
}

module.exports = {
  chunkDocuments,
};