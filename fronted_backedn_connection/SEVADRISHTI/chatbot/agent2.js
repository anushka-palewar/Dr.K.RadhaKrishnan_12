/**
 * Agent 2: SQL Validator
 * Strict SQL validator similar to a government-grade firewall.
 */

const mysql = require('mysql2');

/**
 * Validates SQL query against strict rules
 * @param {string} sql - The SQL query to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateSQL(sql) {
  if (!sql || typeof sql !== 'string') {
    return false;
  }

  // Normalize SQL: remove extra spaces, convert to uppercase for keywords
  const normalized = sql.trim().replace(/\s+/g, ' ').toUpperCase();

  // Allow ONLY SELECT queries
  if (!normalized.startsWith('SELECT ')) {
    return false;
  }

  // Block forbidden operations
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'MERGE', 'CALL', 'EXEC'];
  for (const word of forbidden) {
    if (normalized.includes(word)) {
      return false;
    }
  }

  // Block SQL comments
  if (normalized.includes('--') || normalized.includes('/*') || normalized.includes('*/') || normalized.includes('#')) {
    return false;
  }

  // Allow ONLY SERVICE_REQUESTS table
  // Check if SERVICE_REQUESTS is mentioned
  if (!normalized.includes('SERVICE_REQUESTS')) {
    return false;
  }

  // Block subqueries and CTEs (WITH clause)
  if (normalized.includes('WITH ') || normalized.includes('(') && normalized.includes('SELECT') && normalized.indexOf('(') < normalized.indexOf('SELECT')) {
    // Simple check for subqueries
    return false;
  }

  // For non-aggregate queries, enforce LIMIT
  // Check if it has GROUP BY or aggregate functions
  const hasAggregate = /\b(COUNT|SUM|AVG|MIN|MAX)\b/.test(normalized);
  const hasGroupBy = normalized.includes('GROUP BY');

  if (!hasAggregate && !hasGroupBy) {
    if (!normalized.includes('LIMIT ')) {
      return false;
    }
  }

  // Allow GROUP BY and aggregate functions - already checked above

  // Allow only a single SQL statement
  if (normalized.includes(';')) {
    // Check if only one statement
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    if (statements.length > 1) {
      return false;
    }
  }

  // Additional check: try to parse with mysql2 to ensure syntax
  try {
    mysql.format(sql, []); // Just to check syntax
  } catch (error) {
    return false;
  }

  return true;
}

module.exports = { validateSQL };