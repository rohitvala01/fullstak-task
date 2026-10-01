import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/leads` : '/api/leads';
const api = axios.create({ baseURL: API_BASE });

export const getErrorMessage = (err) =>
  err.response?.data?.message || err.message || 'Something went wrong';

export const fetchLeads = (params) => api.get('/', { params }).then((res) => res.data);
export const createLead = (lead) => api.post('/', lead).then((res) => res.data.data);
export const updateLeadStatus = (id, status) =>
  api.patch(`/${id}/status`, { status }).then((res) => res.data.data);
export const deleteLead = (id) => api.delete(`/${id}`).then((res) => res.data);
