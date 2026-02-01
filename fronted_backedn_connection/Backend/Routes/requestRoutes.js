/**
 * Service Request API routes
 * POST /api/requests - Create a new service request
 */

const router = require("express").Router();
const requestController = require("../controllers/requestController");

router.post("/", requestController.createRequest);

module.exports = router;
