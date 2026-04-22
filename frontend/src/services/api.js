import axios from 'axios'
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })
export const uploadFile = (data) => API.post('/api/audit/upload', data)
export const runAudit = (data) => API.post('/api/audit/run', data)
export const getReport = (id) => API.get(`/api/report/${id}`)
export const getHistory = () => API.get('/api/audit/history')
export default API