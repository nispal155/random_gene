import axios from 'axios';

const api = axios.create({
  baseURL: '/api/accounts',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function generateAccountPreview(payload) {
  const response = await api.post('/generate', payload);
  return response.data;
}

export async function saveAccountRecord(payload) {
  const response = await api.post('/', payload);
  return response.data;
}

export async function fetchAccounts({ page = 1, limit = 10, search = '', formatType = '' }) {
  const params = { page, limit };
  if (search) params.search = search;
  if (formatType) params.formatType = formatType;
  const response = await api.get('/', { params });
  return response.data;
}

export async function deleteAccountRecord(id) {
  const response = await api.delete(`/${id}`);
  return response.data;
}

export function getExportCSVUrl({ search = '', formatType = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (formatType) params.append('formatType', formatType);
  return `/api/accounts/export?${params.toString()}`;
}
