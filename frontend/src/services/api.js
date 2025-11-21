import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Voter API
export const voterAPI = {
  getAll: async () => {
    const response = await api.get('/voters')
    return response.data
  },
  
  verify: async (voterID) => {
    const response = await api.put(`/voters/verify/${voterID}`)
    return response.data
  },
}

// Election API
export const electionAPI = {
  getAll: async () => {
    const response = await api.get('/elections')
    return response.data
  },
  
  getActive: async () => {
    const response = await api.get('/elections/active')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/elections/${id}`)
    return response.data
  },
}

// Candidate API
export const candidateAPI = {
  getByElection: async (electionId) => {
    const response = await api.get(`/candidates/election/${electionId}`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/candidates/${id}`)
    return response.data
  },
  
  rate: async (candidateId, data) => {
    const response = await api.post(`/candidates/${candidateId}/rate`, data)
    return response.data
  },
  
  getRatings: async (candidateId) => {
    const response = await api.get(`/candidates/${candidateId}/ratings`)
    return response.data
  },
}

// Vote API
export const voteAPI = {
  cast: async (data) => {
    const response = await api.post('/votes/cast', data)
    return response.data
  },
  
  getHistory: async (voterId) => {
    const response = await api.get(`/votes/history/${voterId}`)
    return response.data
  },
  
  getReceipt: async (confirmationId) => {
    const response = await api.get(`/votes/receipt/${confirmationId}`)
    return response.data
  },
  
  hasVoted: async (voterId, electionId) => {
    const response = await api.get(`/votes/has-voted/${voterId}/${electionId}`)
    return response.data
  },
  
  getResults: async (electionId) => {
    const response = await api.get(`/votes/results/${electionId}`)
    return response.data
  },
  
  getRealTime: async (electionId) => {
    const response = await api.get(`/votes/realtime/${electionId}`)
    return response.data
  },
  
  getStatistics: async (electionId) => {
    const response = await api.get(`/votes/statistics/${electionId}`)
    return response.data
  },
}

// Notification API
export const notificationAPI = {
  getByVoter: async (voterId) => {
    const response = await api.get(`/notifications/voter/${voterId}`)
    return response.data
  },
  
  getUnreadCount: async (voterId) => {
    const response = await api.get(`/notifications/voter/${voterId}/unread-count`)
    return response.data
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  },
  
  markAllAsRead: async (voterId) => {
    const response = await api.put(`/notifications/voter/${voterId}/read-all`)
    return response.data
  },
}

// Polling Station API
export const pollingStationAPI = {
  getAll: async () => {
    const response = await api.get('/polling-stations')
    return response.data
  },
  
  findNearby: async (latitude, longitude, radius = 10) => {
    const response = await api.get(`/polling-stations/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/polling-stations/${id}`)
    return response.data
  },
}

// Feedback API
export const feedbackAPI = {
  submit: async (data) => {
    const response = await api.post('/feedback', data)
    return response.data
  },
  
  getAll: async (status) => {
    const url = status ? `/feedback?status=${status}` : '/feedback'
    const response = await api.get(url)
    return response.data
  },
}

// Education API
export const educationAPI = {
  getResources: async (language, type) => {
    let url = '/education'
    const params = []
    if (language) params.push(`language=${language}`)
    if (type) params.push(`type=${type}`)
    if (params.length > 0) url += '?' + params.join('&')
    const response = await api.get(url)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/education/${id}`)
    return response.data
  },
}

// Enhanced Auth API
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { Email: email, Password: password })
    return response.data
  },
  
  loginAdmin: async (username, password) => {
    const response = await api.post('/admin/login', { Username: username, Password: password })
    return response.data
  },
  
  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { Email: email, OTPCode: otp })
    return response.data
  },
  
  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { Email: email })
    return response.data
  },
}

export default api

