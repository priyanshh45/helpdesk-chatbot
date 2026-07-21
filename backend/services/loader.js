const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const KNOWLEDGE_DIR = path.join(__dirname, "../knowledge");

// Read all markdown files recursively
async function getMarkdownFiles(dir) {
  let files = [];

  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subFiles = await getMarkdownFiles(fullPath);
      files.push(...subFiles);
    } else if (item.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Load all knowledge files
async function loadKnowledge() {
  const markdownFiles = await getMarkdownFiles(KNOWLEDGE_DIR);

  const documents = [];

  for (const file of markdownFiles) {
    const raw = await fs.readFile(file, "utf8");

    const parsed = matter(raw);

    const plainText = marked.parse(parsed.content)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    documents.push({
      title:
        parsed.data.title ||
        path.basename(file, ".md"),

      category:
        parsed.data.category ||
        "General",

      tags:
        parsed.data.tags ||
        [],

      file:
        path.basename(file),

      content:
        plainText
    });
  }

  return documents;
}

module.exports = {
  loadKnowledge
};