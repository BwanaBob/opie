// oplChromaClient.js
const { ChromaClient } = require('chromadb');
const { OpenAIEmbeddings } = require('@langchain/openai');
// import * as dotenv from 'dotenv';
// dotenv.config();
require("dotenv").config();


const numResults = process.env.CHROMA_NUM_RESULTS ? Number(process.env.CHROMA_NUM_RESULTS) : 3;
const collectionName = process.env.CHROMA_COLLECTION_NAME || 'opl-knowledge';
const host = process.env.CHROMA_HOST || 'localhost';
const port = process.env.CHROMA_PORT ? Number(process.env.CHROMA_PORT) : 8712;
const ssl = process.env.CHROMA_SSL === 'true';
// Set a default relevance threshold (distance) for Chroma results. Lower is more relevant.
const relevanceThreshold = process.env.CHROMA_RELEVANCE_THRESHOLD ? Number(process.env.CHROMA_RELEVANCE_THRESHOLD) : 0.4;

process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.CHATGPT_API_KEY;

async function queryOplChroma(queryText, topK = numResults, model = 'text-embedding-ada-002') {
  const client = new ChromaClient({ host, port, ssl });
  const collectionsToQuery = ['opl-knowledge', 'knowledge'];
  const embeddings = new OpenAIEmbeddings({ model });
  const [queryEmbedding] = await embeddings.embedDocuments([queryText]);

  // Query all collections in parallel
  const allResults = await Promise.all(collectionsToQuery.map(async (colName) => {
    try {
      const collection = await client.getCollection({ name: colName });
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        include: ['documents', 'metadatas', 'distances'],
      });
      return results.documents[0].map((text, i) => ({
        text,
        metadata: results.metadatas[0][i],
        score: results.distances[0][i],
        collection: colName
      }));
    } catch (err) {
      console.error(`[ERROR] Querying collection ${colName}:`, err.message);
      // If collection doesn't exist or query fails, return empty
      return [];
    }
  }));

  // Flatten, filter by relevance, and sort by score (ascending)
  const merged = allResults.flat().filter(r => typeof r.score === 'number' && r.score <= relevanceThreshold);
  merged.sort((a, b) => a.score - b.score);
  // Return only the topK most relevant results
  return merged.slice(0, topK);
}

module.exports = {
  queryOplChroma
};