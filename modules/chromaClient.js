// oplChromaClient.js
const { ChromaClient } = require('chromadb');
const { OpenAIEmbeddings } = require('@langchain/openai');
// import * as dotenv from 'dotenv';
// dotenv.config();

const options = require("../options.json");

const {
  host,
  port,
  ssl
} = options.modules.chroma.ChromaClient;
const collectionName = options.modules.chroma.collectionName;
const numResults = options.modules.chroma.numResults;

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
  // Return results as an array of { text, metadata, score }
//   console.log(`Chroma query results for "${queryText}":`, results);
  return results.documents[0].map((text, i) => ({
    text,
    metadata: results.metadatas[0][i],
    score: results.distances[0][i],
  }));
}

module.exports = {
  queryOplChroma
};