/**
 * Service Request API
 * POST /api/requests - Create a new service request
 */

import api from "./connection";

export async function createRequest(data) {
  const { data: result } = await api.post("/requests", data);
  return result;
}
