require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Agent-4: Result Interpreter (LLM)
// - Receives: userQuestion (string), validatedSQL (string, context-only), rows (Array of objects)
// - Uses an LLM with deterministic settings to produce a concise, factual, government-appropriate
//   natural language answer based ONLY on the provided rows. The LLM is instructed to return a
//   JSON object with keys: direct_answer, supporting_details, insights.
// - MUST NOT hallucinate, must not mention SQL/tables/columns/agent architecture, must not generate SQL.
// - Returns: { success: true, answer: { direct_answer, supporting_details, insights } } or { success: false, error }

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

async function interpretResult(userQuestion, validatedSQL, rows = [], options = {}) {
  const { maxRowsInPrompt = 200 } = options;

  try {
    if (!userQuestion || typeof userQuestion !== 'string') {
      throw new Error('userQuestion is required (string)');
    }

    if (!Array.isArray(rows)) {
      throw new Error('rows must be an array');
    }

    const rowsToSend = rows.length > maxRowsInPrompt ? rows.slice(0, maxRowsInPrompt) : rows;
    const truncated = rows.length > maxRowsInPrompt;
    const rowsJson = JSON.stringify(rowsToSend, null, 2);

    const SYSTEM_PROMPT = `You are a factual, neutral, and policy-appropriate result interpreter for a government analytics dashboard.\
Only use the provided query results (the JSON rows) to answer the user's question. Do NOT invent, guess, or hallucinate any numbers, trends, or facts that are not present in the provided rows.\
Do NOT generate or suggest SQL, do NOT access any database, and do NOT mention or repeat SQL queries, table names, column names, or internal agent architecture in your final answer.\
If the provided rows are empty, the interpreter should return a direct answer indicating no records were found.\
Structure the response as a JSON object with exactly three keys: direct_answer, supporting_details, and insights.\
* direct_answer: a single concise sentence that directly answers the user's question (1 sentence, 10-25 words ideally).\
* supporting_details: 1-2 short sentences referencing only values present in the provided rows (for example, counts or top rows).\
* insights: 0-2 brief observations or caveats derived strictly from the data (only if supported).\
Return ONLY the JSON object, with no surrounding text, markdown, or explanation. Be concise (total output 2-4 sentences worth). Be formal and suitable for a government dashboard.`;

    const userContent = `User question: ${userQuestion}\n\nContext (for your information only — do NOT mention this in your answer):\n${validatedSQL || '[none]'}\n\nQuery results (JSON):\n${rowsJson}${truncated ? `\n\n(Note: results truncated to first ${maxRowsInPrompt} rows for brevity)` : ''}`;

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ],
        max_tokens: 512
      })
    });

    const json = await resp.json();

    if (!resp.ok) {
      const errMsg = json?.error || JSON.stringify(json);
      return { success: false, error: `LLM error: ${errMsg}` };
    }

    const raw = (json.choices?.[0]?.message?.content || '').trim();
    if (!raw) return { success: false, error: 'LLM returned empty content' };

    // Parse JSON output
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch (e2) {
          return { success: false, error: 'LLM returned malformed JSON' };
        }
      } else {
        return { success: false, error: 'LLM did not return JSON' };
      }
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { success: false, error: 'LLM returned invalid JSON structure' };
    }

    const { direct_answer, supporting_details, insights } = parsed;

    // Validate and sanitize all fields (ensure they are strings)
    if (!direct_answer || typeof direct_answer !== 'string') {
      return { success: false, error: 'direct_answer missing or invalid in LLM response' };
    }

    const sanitized_direct_answer = String(direct_answer).trim();
    const sanitized_supporting_details = supporting_details && typeof supporting_details === 'string' ? String(supporting_details).trim() : '';
    const sanitized_insights = insights && typeof insights === 'string' ? String(insights).trim() : '';

    // Ensure no forbidden internal tokens appear
    const forbidden = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'TABLE', 'COLUMN', 'QUERY', 'SQL'];
    const upper = JSON.stringify(parsed).toUpperCase();
    for (const token of forbidden) if (upper.includes(token)) return { success: false, error: 'LLM returned disallowed internal terms' };

    return { success: true, answer: { direct_answer: sanitized_direct_answer, supporting_details: sanitized_supporting_details, insights: sanitized_insights } };

  } catch (err) {
    return { success: false, error: err.message || String(err) };
  }
}

module.exports = { interpretResult };