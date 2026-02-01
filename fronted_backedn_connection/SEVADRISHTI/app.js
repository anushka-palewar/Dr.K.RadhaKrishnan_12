/**
 * Chatbot Routes
 * Express routes for the AI assistant chatbot
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { generateSQL, validateSQL, executeSQL, interpretResult, generateInsight } = require('./chatbot');

// Create router
const router = express.Router();

// Middleware for this router
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// API endpoint for chatbot
router.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    // Agent 1: Generate SQL
    const sql = await generateSQL(question);

    // Agent 2: Validate SQL
    const isValid = validateSQL(sql);

    if (!isValid) {
      return res.json({
        question,
        sql,
        valid: false,
        result: null,
        interpretation: null,
        insight: 'Invalid SQL generated'
      });
    }

    // Agent 3: Execute SQL
    const result = await executeSQL(sql);

    // Agent 4: Interpret Result
    let interpretation = null;
    if (result.success) {
      interpretation = await interpretResult(question, sql, result.rows);
    }

    // Insight Generator
    const insight = generateInsight(result.rows, question);

    res.json({
      question,
      sql,
      valid: true,
      result,
      interpretation,
      insight
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process your question. Please check your API configuration.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve the chatbot interface
router.use('/chatbot', express.static(path.join(__dirname, 'public')));
router.get('/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the router for use in other apps
module.exports = router;