/**
 * Main entry point for the 3-agent SQL analytics chatbot
 * CLI version for testing
 */

const { generateSQL, validateSQL, executeSQL, interpretResult, generateInsight } = require('./chatbot/index');

// Example usage
async function main() {
  const questions = [
    "Which team breached SLA the most?",
    "Average resolution time by category",
    "SLA trend over time",
    "Which department raises most requests?",
    "Which priorities cause delays?",
    "Teams with highest reopen count",
    "Open vs resolved requests"
  ];

  for (const question of questions) {
    console.log(`\nQuestion: ${question}`);

    // Agent 1: Generate SQL
    const sql = await generateSQL(question);
    console.log(`Generated SQL: ${sql}`);

    // Agent 2: Validate SQL
    const isValid = validateSQL(sql);
    console.log(`Valid: ${isValid}`);

    if (isValid) {
      // Agent 3: Execute SQL
      const result = await executeSQL(sql);
      console.log(`Execution Result: ${result.success ? 'Success' : 'Failed'}`);
      if (result.success) {
        console.log(`Rows: ${result.count}, Time: ${result.executionTime}ms`);

        // Agent 4: Interpret Result
        const interpretation = await interpretResult(question, sql, result.rows);
        if (interpretation.success) {
          console.log('Interpretation:');
          console.log(`Direct Answer: ${interpretation.answer.direct_answer}`);
          console.log(`Supporting Details: ${interpretation.answer.supporting_details}`);
          console.log(`Insights: ${interpretation.answer.insights}`);
        } else {
          console.log(`Interpretation Error: ${interpretation.error}`);
        }

        // Insight Generator (fallback)
        const insight = generateInsight(result.rows, question);
        console.log(`Insight: ${insight}`);
      } else {
        console.log(`Error: ${result.error}`);
      }
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };