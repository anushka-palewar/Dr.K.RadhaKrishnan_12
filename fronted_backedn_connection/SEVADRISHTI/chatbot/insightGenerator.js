/**
 * Insight Generator
 * Converts SQL result rows into natural-language insights
 */

/**
 * Generates insights from SQL results
 * @param {Array} rows - The result rows from SQL execution
 * @param {string} originalQuestion - The original user question
 * @returns {string} - Natural language insight
 */
function generateInsight(rows, originalQuestion) {
  if (!rows || rows.length === 0) {
    return "No data available for this query.";
  }

  const q = originalQuestion.toLowerCase();

  if (q.includes('team') && q.includes('breached') && q.includes('sla')) {
    // Rows: [{AssignedTeam, BreachCount}]
    const maxBreach = rows.reduce((max, row) => row.BreachCount > max.BreachCount ? row : max, rows[0]);
    return `${maxBreach.AssignedTeam} team has the highest SLA breach count with ${maxBreach.BreachCount} breaches.`;
  } else if (q.includes('average') && q.includes('resolution') && q.includes('category')) {
    // Rows: [{Category, AvgResolutionTime}]
    const validRows = rows.filter(row => row.AvgResolutionTime != null);
    if (validRows.length === 0) {
      return "No valid resolution time data available for any category.";
    }
    const slowest = validRows.reduce((max, row) => row.AvgResolutionTime > max.AvgResolutionTime ? row : max, validRows[0]);
    return `${slowest.Category} category has the highest average resolution time of ${slowest.AvgResolutionTime.toFixed(2)} hours.`;
  } else if (q.includes('sla') && q.includes('trend') && q.includes('time')) {
    // Rows: [{Date, TotalRequests, BreachedCount}]
    const totalBreaches = rows.reduce((sum, row) => sum + row.BreachedCount, 0);
    const totalRequests = rows.reduce((sum, row) => sum + row.TotalRequests, 0);
    const breachRate = ((totalBreaches / totalRequests) * 100).toFixed(2);
    return `Overall SLA breach rate is ${breachRate}%, with ${totalBreaches} breaches out of ${totalRequests} total requests.`;
  } else if (q.includes('department') && q.includes('raises') && q.includes('most') && q.includes('request')) {
    // Rows: [{RequesterDepartment, RequestCount}]
    const topDept = rows[0];
    return `${topDept.RequesterDepartment} department raises the most requests with ${topDept.RequestCount} total requests.`;
  } else if (q.includes('priorities') && q.includes('cause') && q.includes('delay')) {
    // Rows: [{Priority, AvgResolutionTime}]
    const highestDelay = rows[0];
    return `${highestDelay.Priority} priority requests have the highest average resolution time of ${highestDelay.AvgResolutionTime.toFixed(2)} hours, indicating potential delays.`;
  } else if (q.includes('team') && q.includes('highest') && q.includes('reopen')) {
    // Rows: [{AssignedTeam, TotalReopens}]
    const topTeam = rows[0];
    return `${topTeam.AssignedTeam} team has the highest total reopen count with ${topTeam.TotalReopens} reopens.`;
  } else if (q.includes('open') && q.includes('resolved') && q.includes('request')) {
    // Rows: [{Status, Count}]
    const open = rows.find(r => r.Status === 'New' || r.Status === 'In Progress') || {Count: 0};
    const resolved = rows.find(r => r.Status === 'Resolved' || r.Status === 'Closed') || {Count: 0};
    return `There are ${open.Count} open requests and ${resolved.Count} resolved/closed requests.`;
  } else {
    return "Query executed successfully. " + JSON.stringify(rows.slice(0, 5)) + (rows.length > 5 ? " ... and more" : "");
  }
}

module.exports = { generateInsight };