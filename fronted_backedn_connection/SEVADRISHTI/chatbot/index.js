/**
 * Chatbot Module
 * Exports all agent functions for easy integration
 */

const { generateSQL } = require('./agent1');
const { validateSQL } = require('./agent2');
const { executeSQL } = require('./agent3');
const { interpretResult } = require('./agent4');
const { generateInsight } = require('./insightGenerator');

module.exports = {
  generateSQL,
  validateSQL,
  executeSQL,
  interpretResult,
  generateInsight
};