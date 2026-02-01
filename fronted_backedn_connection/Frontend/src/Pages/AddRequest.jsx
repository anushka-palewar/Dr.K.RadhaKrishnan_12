import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../api/requestApi";
import "./AddRequest.css";

const CATEGORIES = ["IT Support", "Facilities", "HR", "Academic", "Finance"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const STATUSES = ["New", "In Progress", "Pending Info", "Resolved", "Closed"];
const SLA_HOURS = [4, 8, 24, 48, 72];
const DEPARTMENTS = ["Engineering", "Admin", "Faculty", "Student Services", "Management"];

export default function AddRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    Category: "",
    SubCategory: "",
    Priority: "",
    Status: "New",
    AssignedTeam: "",
    AssignedTo: "",
    SLA_Hours: "",
    RequesterDepartment: "",
    Description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.Category || !form.SubCategory?.trim() || !form.Priority || !form.Status || !form.AssignedTeam?.trim() || !form.SLA_Hours || !form.RequesterDepartment) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        SLA_Hours: Number(form.SLA_Hours),
        AssignedTo: form.AssignedTo?.trim() || undefined,
        Description: form.Description?.trim() || undefined,
      };
      const result = await createRequest(payload);
      setSuccess(`Request created: ${result.RequestID}`);
      setForm({
        Category: "",
        SubCategory: "",
        Priority: "",
        Status: "New",
        AssignedTeam: "",
        AssignedTo: "",
        SLA_Hours: "",
        RequesterDepartment: "",
        Description: "",
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details?.join?.(" ") || err.message || "Failed to create request.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-request-page">
      <header className="add-request-header">
        <h1>Add Service Request</h1>
        <p>Create a new entry in SERVICE_REQUESTS.</p>
      </header>

      <form className="add-request-form" onSubmit={handleSubmit}>
        {error && <div className="add-request-error" role="alert">{error}</div>}
        {success && <div className="add-request-success" role="status">{success}</div>}

        <div className="form-row">
          <label className="form-label required">Category</label>
          <select name="Category" value={form.Category} onChange={handleChange} required className="form-select">
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label required">SubCategory</label>
          <input
            type="text"
            name="SubCategory"
            value={form.SubCategory}
            onChange={handleChange}
            placeholder="e.g. Hardware, Software"
            maxLength={100}
            required
            className="form-input"
          />
        </div>

        <div className="form-row two-cols">
          <div>
            <label className="form-label required">Priority</label>
            <select name="Priority" value={form.Priority} onChange={handleChange} required className="form-select">
              <option value="">Select priority</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label required">Status</label>
            <select name="Status" value={form.Status} onChange={handleChange} required className="form-select">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row two-cols">
          <div>
            <label className="form-label required">Assigned Team</label>
            <input
              type="text"
              name="AssignedTeam"
              value={form.AssignedTeam}
              onChange={handleChange}
              placeholder="e.g. Team A"
              maxLength={50}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Assigned To (optional)</label>
            <input
              type="text"
              name="AssignedTo"
              value={form.AssignedTo}
              onChange={handleChange}
              placeholder="Assignee name"
              maxLength={100}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row two-cols">
          <div>
            <label className="form-label required">SLA Hours</label>
            <select name="SLA_Hours" value={form.SLA_Hours} onChange={handleChange} required className="form-select">
              <option value="">Select SLA</option>
              {SLA_HOURS.map((h) => (
                <option key={h} value={h}>{h} hours</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label required">Requester Department</label>
            <select name="RequesterDepartment" value={form.RequesterDepartment} onChange={handleChange} required className="form-select">
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Description (optional)</label>
          <textarea
            name="Description"
            value={form.Description}
            onChange={handleChange}
            placeholder="Brief description of the request"
            rows={4}
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/")} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating…" : "Create Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
