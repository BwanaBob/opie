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
  const client = new ChromaClient({
    host: host,
    port: port,
    ssl: ssl,
  });
  const collection = await client.getCollection({ name: collectionName });
  const embeddings = new OpenAIEmbeddings({ model });
  const [queryEmbedding] = await embeddings.embedDocuments([queryText]);
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    include: ['documents', 'metadatas', 'distances'],
  });
  // Return results as an array of { text, metadata, score }, filtered by relevance threshold
  //   console.log(`Chroma query results for "${queryText}":`, results);
  return results.documents[0].map((text, i) => ({
    text,
    metadata: results.metadatas[0][i],
    score: results.distances[0][i],
  })).filter(r => typeof r.score === 'number' && r.score <= relevanceThreshold);
}

module.exports = {
  queryOplChroma
};