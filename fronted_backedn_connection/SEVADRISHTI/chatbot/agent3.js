/**
 * Agent 3: SQL Executor
 * Read-only MySQL executor using mysql2/promise
 */

const mysql = require('mysql2/promise');

// Database configuration - use read-only user
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'readonly_user', // Read-only user
  password: process.env.DB_PASSWORD || 'readonly_password',
  database: process.env.DB_NAME || 'college_service_db',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000, // 60 seconds timeout
};

// Create connection pool
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Executes validated SQL query
 * @param {string} sql - The validated SQL query
 * @returns {Promise<Object>} - Result object with success, rows, count, executionTime, error
 */
async function executeSQL(sql) {
  const startTime = Date.now();

  try {
    const connection = await getPool().getConnection();

    // Set max rows limit
    const maxRows = 1000; // Enforce max rows

    // Execute query with timeout
    const [rows] = await connection.execute(sql);

    connection.release();

    const executionTime = Date.now() - startTime;

    // Limit rows if necessary
    const limitedRows = Array.isArray(rows) ? rows.slice(0, maxRows) : rows;

    return {
      success: true,
      rows: limitedRows,
      count: limitedRows.length,
      executionTime,
      error: null
    };

  } catch (error) {
    const executionTime = Date.now() - startTime;

    return {
      success: false,
      rows: [],
      count: 0,
      executionTime,
      error: error.message
    };
  }
}

module.exports = { executeSQL };