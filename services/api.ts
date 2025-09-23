import { LoginIn, RegisterIn, TokenOut, UserOut, ProjectCreate, ProjectOut, InputsCreate, InputsOut, CalcResultOut, HTTPValidationError, PaymentCheckoutIn, SocialLinkCreate, SocialLinkOut } from '../types';

const API_BASE_URL = 'https://solar-app-backend-production.up.railway.app'; // This should be configured via environment variables

const getAuthToken = (): string | null => localStorage.getItem('authToken');

const api = {
  async request<T,>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', response.status, errorData);
            
            let errorMessage = `HTTP error! status: ${response.status}`; // Default message
            
            if (errorData.detail && typeof errorData.detail === 'string') {
                // Handle simple string detail messages
                errorMessage = errorData.detail;
            } else if (errorData.detail && Array.isArray(errorData.detail)) {
                // Handle validation errors (HTTPValidationError)
                errorMessage = errorData.detail.map((e: any) => e.msg || 'A validation error occurred').join(', ');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }

            throw new Error(errorMessage);
        }
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }
        return response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
  },

  // Auth
  register: (data: RegisterIn) => api.request<UserOut>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginIn) => api.request<TokenOut>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => api.request<UserOut>('/auth/me'),
  
  // Projects
  getProjects: () => api.request<ProjectOut[]>('/projects'),
  createProject: (data: ProjectCreate) => api.request<ProjectOut>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  
  // Inputs
  saveInputs: (projectId: number, data: InputsCreate) => api.request<InputsOut>(`/projects/${projectId}/inputs`, { method: 'POST', body: JSON.stringify(data) }),

  // Calculations
  runCalculation: (projectId: number) => api.request<CalcResultOut>(`/projects/${projectId}/calculate`, { method: 'POST' }),

  // Payments
  createCheckoutSession: (data: PaymentCheckoutIn) => api.request<Record<string, unknown>>('/payments/checkout', { method: 'POST', body: JSON.stringify(data) }),
  
  // Social Links
  getSocialLinks: () => api.request<SocialLinkOut[]>('/users/me/social-links'),
  createSocialLink: (data: SocialLinkCreate) => api.request<SocialLinkOut>('/users/me/social-links', { method: 'POST', body: JSON.stringify(data) }),
};

export default api;