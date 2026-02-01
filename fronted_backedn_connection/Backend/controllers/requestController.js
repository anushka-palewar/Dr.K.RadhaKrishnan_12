/**
 * Service Request Controller
 * Inserts new rows into SERVICE_REQUESTS (MySQL)
 */

const pool = require("../config/mysql");

const CATEGORIES = ["IT Support", "Facilities", "HR", "Academic", "Finance"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const STATUSES = ["New", "In Progress", "Pending Info", "Resolved", "Closed"];
const SLA_HOURS = [4, 8, 24, 48, 72];
const DEPARTMENTS = ["Engineering", "Admin", "Faculty", "Student Services", "Management"];
const SLA_STATUSES = ["Met", "Breached", "At Risk"];

function generateRequestId() {
  return "REQ" + Date.now().toString().slice(-16);
}

function validateBody(body) {
  const errors = [];
  if (!body.Category || !CATEGORIES.includes(body.Category)) {
    errors.push("Category must be one of: " + CATEGORIES.join(", "));
  }
  if (!body.SubCategory || typeof body.SubCategory !== "string" || !body.SubCategory.trim()) {
    errors.push("SubCategory is required (max 100 chars).");
  }
  if (!body.Priority || !PRIORITIES.includes(body.Priority)) {
    errors.push("Priority must be one of: " + PRIORITIES.join(", "));
  }
  if (!body.Status || !STATUSES.includes(body.Status)) {
    errors.push("Status must be one of: " + STATUSES.join(", "));
  }
  if (!body.AssignedTeam || typeof body.AssignedTeam !== "string" || !body.AssignedTeam.trim()) {
    errors.push("AssignedTeam is required (max 50 chars).");
  }
  const sla = Number(body.SLA_Hours);
  if (body.SLA_Hours == null || body.SLA_Hours === "" || !SLA_HOURS.includes(sla)) {
    errors.push("SLA_Hours must be one of: 4, 8, 24, 48, 72");
  }
  if (!body.RequesterDepartment || !DEPARTMENTS.includes(body.RequesterDepartment)) {
    errors.push("RequesterDepartment must be one of: " + DEPARTMENTS.join(", "));
  }
  return errors;
}

async function createRequest(req, res, next) {
  const body = req.body;

  const errors = validateBody(body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  const RequestID = generateRequestId();
  const SubCategory = (body.SubCategory || "").trim().slice(0, 100);
  const AssignedTeam = (body.AssignedTeam || "").trim().slice(0, 50);
  const AssignedTo = body.AssignedTo != null ? String(body.AssignedTo).trim().slice(0, 100) : null;
  const Description = body.Description != null ? String(body.Description).trim() : null;
  const SLA_Hours = Number(body.SLA_Hours);
  const ReopenCount = body.ReopenCount != null ? Math.max(0, parseInt(body.ReopenCount, 10)) : 0;
  const ActualResolutionHours = body.ActualResolutionHours != null ? parseFloat(body.ActualResolutionHours) : null;
  const FirstResponseHours = body.FirstResponseHours != null ? parseFloat(body.FirstResponseHours) : null;
  const ResolutionDate = body.ResolutionDate || null;
  const SLA_Status = body.SLA_Status && SLA_STATUSES.includes(body.SLA_Status) ? body.SLA_Status : null;

  const SubmittedDate = body.SubmittedDate || new Date().toISOString().slice(0, 19).replace("T", " ");
  const sql = `INSERT INTO SERVICE_REQUESTS (
    RequestID, SubmittedDate, Category, SubCategory, Priority, Status,
    AssignedTeam, AssignedTo, ResolutionDate, SLA_Hours, ActualResolutionHours,
    SLA_Status, RequesterDepartment, Description, ReopenCount, FirstResponseHours
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    RequestID,
    SubmittedDate,
    body.Category,
    SubCategory,
    body.Priority,
    body.Status,
    AssignedTeam,
    AssignedTo,
    ResolutionDate,
    SLA_Hours,
    ActualResolutionHours,
    SLA_Status,
    body.RequesterDepartment,
    Description,
    ReopenCount,
    FirstResponseHours,
  ];

  try {
    const [result] = await pool.execute(sql, values);
    return res.status(201).json({
      success: true,
      message: "Service request created",
      RequestID,
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("Create request error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to create service request",
    });
  }
}

module.exports = { createRequest };
