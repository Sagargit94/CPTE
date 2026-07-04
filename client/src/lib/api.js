import { supabase } from './supabaseClient.js';

const API_BASE = import.meta.env.VITE_API_URL || 'https://cpte-api.onrender.com';

export async function apiFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let body;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  if (!res.ok) {
    const msg = body?.error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return body;
}

export const getTemplates = () => apiFetch('/api/templates');

export const startAttempt = (template_id, mode) =>
  apiFetch('/api/attempts', {
    method: 'POST',
    body: JSON.stringify({ template_id, mode })
  });

export const getAttempt = (id) => apiFetch(`/api/attempts/${id}`);

export const saveAnswer = (attemptId, question_id, selected_option_index, is_flagged) =>
  apiFetch(`/api/attempts/${attemptId}/answers`, {
    method: 'PATCH',
    body: JSON.stringify({ question_id, selected_option_index, is_flagged })
  });

export const submitAttempt = (id) =>
  apiFetch(`/api/attempts/${id}/submit`, { method: 'POST' });

export const getHistory = () => apiFetch('/api/attempts/history');
export const getDashboard = () => apiFetch('/api/attempts/dashboard');
export const getLimits = () => apiFetch('/api/attempts/limits');
export const resumeAttempt = (id) => apiFetch(`/api/attempts/${id}`);
