/**
 * AI Assistance Controller
 * Uses SEVADRISHTI chatbot pipeline: generateSQL -> validateSQL -> executeSQL -> interpretResult -> generateInsight
 *
 * Env vars are loaded from SEVADRISHTI/.env automatically. Put there (or in Backend/.env):
 *   GROQ_API_KEY - for SQL generation and result interpretation (agent1, agent4)
 *   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME - for MySQL execution (agent3; database: college_service_db)
 * Ensure SEVADRISHTI has its dependencies: run "npm install" in the SEVADRISHTI folder.
 */

const path = require("path");

// Load SEVADRISHTI .env so GROQ_API_KEY and DB_* are available when chatbot runs
require("dotenv").config({
  path: path.join(__dirname, "../../../SEVADRISHTI/.env"),
});

// Load SEVADRISHTI chatbot from sibling folder (workspace root: Dr.K.RadhaKrishnan_12)
const chatbotPath = path.join(__dirname, "../../../SEVADRISHTI/chatbot");

async function chat(req, res, next) {
  const { question } = req.body;

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      success: false,
      error: "Question is required and must be a non-empty string.",
    });
  }

  try {
    const {
      generateSQL,
      validateSQL,
      executeSQL,
      interpretResult,
      generateInsight,
    } = require(chatbotPath);

    // Agent 1: Generate SQL
    const sql = await generateSQL(question.trim());

    // Agent 2: Validate SQL
    const valid = validateSQL(sql);

    if (!valid) {
      return res.json({
        success: true,
        question: question.trim(),
        sql,
        valid: false,
        result: null,
        interpretation: null,
        insight: "Invalid SQL generated. Try rephrasing your question.",
      });
    }

    // Agent 3: Execute SQL
    const result = await executeSQL(sql);

    let interpretation = null;
    let insight = "No data available for this query.";

    if (result.success) {
      // Agent 4: Interpret Result
      interpretation = await interpretResult(
        question.trim(),
        sql,
        result.rows
      );
      insight = generateInsight(result.rows, question.trim());
    }

    res.json({
      success: true,
      question: question.trim(),
      sql,
      valid: true,
      result: {
        success: result.success,
        count: result.count,
        executionTime: result.executionTime,
        error: result.error || null,
      },
      interpretation,
      insight,
    });
  } catch (err) {
    console.error("AI chat error:", err.message || err);
    res.status(500).json({
      success: false,
      error:
        err.message ||
        "Failed to process your question. Check GROQ_API_KEY and DB config in .env.",
    });
  }
}

module.exports = { chat };
