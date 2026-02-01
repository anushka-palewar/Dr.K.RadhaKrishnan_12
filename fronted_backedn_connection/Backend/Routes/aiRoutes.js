/**
 * AI Assistance API routes
 * POST /api/ai/chat - Send a question and get SQL analytics response
 */

const router = require("express").Router();
const aiController = require("../controllers/aiController");

router.post("/chat", aiController.chat);

module.exports = router;
