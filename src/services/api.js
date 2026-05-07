// Base API configuration - all requests go through here
const BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.message || data?.error || 'Request failed';
    throw new Error(msg);
  }
  return data?.data !== undefined ? data.data : data;
};

export const api = {
  get: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  put: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  patch: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  delete: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
