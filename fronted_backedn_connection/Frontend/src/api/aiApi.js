/**
 * AI Assistance API
 * POST /api/ai/chat - Send a question and get analytics response
 */

import api from "./connection";

export async function sendQuestion(question) {
  const { data } = await api.post("/ai/chat", { question });
  return data;
}
