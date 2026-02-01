/**
 * Agent 1: SQL Query Generator
 * Uses Groq API for natural language to SQL conversion
 */

require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const SYSTEM_PROMPT = `You are an SQL query generator for a College Service Operations Analytics Dashboard.

Your ONLY job is to convert natural language questions into valid SQL SELECT queries.

DATABASE SCHEMA:

Table: SERVICE_REQUESTS
- RequestID VARCHAR(20) PRIMARY KEY
- SubmittedDate DATETIME
- Category ENUM('IT Support','Facilities','HR','Academic','Finance')
- SubCategory VARCHAR(100)
- Priority ENUM('Critical','High','Medium','Low')
- Status ENUM('New','In Progress','Pending Info','Resolved','Closed')
- AssignedTeam VARCHAR(50)
- AssignedTo VARCHAR(100)
- ResolutionDate DATETIME
- SLA_Hours INT (4,8,24,48,72)
- ActualResolutionHours DECIMAL(6,2)
- SLA_Status ENUM('Met','Breached','At Risk')
- RequesterDepartment ENUM('Engineering','Admin','Faculty','Student Services','Management')
- Description TEXT
- ReopenCount INT
- FirstResponseHours DECIMAL(5,2)
- CreatedAt TIMESTAMP

STRICT RULES (MANDATORY):

1. Generate ONLY SELECT queries
2. NEVER generate: INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE
3. Use ONLY the SERVICE_REQUESTS table
4. Use single quotes for string values
5. Use proper COUNT, SUM, GROUP BY, ORDER BY, WHERE clauses
6. If returning multiple rows (not aggregates), add LIMIT 100
7. Never invent columns or tables that don't exist
8. Handle both English and Hindi/Hinglish questions

OUTPUT FORMAT:

- Return ONLY the raw SQL query
- No markdown formatting
- No code blocks
- No explanations
- No comments in the SQL
- Clean and properly formatted SQL`;

// Sleep utility for retry/backoff
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateSQL(userQuestion) {
  console.log("⏳ Calling GROQ Chat Completion API...");

  const GROQ_API_URL = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not configured. Please set a valid API key in your .env file.');
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userQuestion
          }
        ]
      })
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      json = { raw: text };
    }

    if (!res.ok) {
      console.error('GROQ API returned error:', res.status, text);
      throw new Error(`GROQ API error: ${res.status}`);
    }

    const sql = json.choices?.[0]?.message?.content;

    if (!sql) {
      console.error('GROQ returned no SQL. Response snippet:', JSON.stringify(json).slice(0, 2000));
      throw new Error("No SQL returned from GROQ");
    }

    console.log("✅ GROQ responded");

    return sql
      .replace(/```sql/gi, "")
      .replace(/```/g, "")
      .trim();
  } catch (err) {
    console.error('generateSQL error:', err.message || err);
    throw err;
  }
}

module.exports = {
  generateSQL,
};