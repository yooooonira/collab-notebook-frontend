// 로그인(api/auth/login) -> 토큰 받기  -> 로그인 성공 
import axios, { AxiosInstance } from 'axios';

const API_BASE = 'http://localhost:8000/api';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dGV0ZXlkZnhmcGZtYmplcHVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE1MjAzMywiZXhwIjoyMDczNzI4MDMzfQ.Ifj07P8QzbLkTdUXm-Gz3aczg5GHc-X3T3YcPtIx3NM';

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 토큰 로드
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.setToken(savedToken);
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    delete this.api.defaults.headers.common['Authorization'];
  }

  // 인증
  async signup(email: string, password: string) {
    const signupRes = await axios.post(
    '${SUPABASE_URL}auth/v1/signup',
    { email, password },
    { headers: { 'apikey': SUPABASE_KEY } }
    );
    return signupRes.data;
  }

  async login(email: string, password: string) {
    const res = await this.api.post('/auth/login/', { email, password });
    return res.data;
  }

  async registerUser(supabase_id: string, email: string, role: string) {
    const res = await axios.post(`${API_BASE}/auth/signup/`, {
      supabase_id,
      email,
      role,
    });
    return res.data;
  }

  async getMe() {
    const res = await this.api.get('/auth/me/');
    return res.data;
  }

  // 폴더
  async getFolders() {
    const res = await this.api.get('/folders/');
    return res.data;
  }

  async createFolder(name: string) {
    const res = await this.api.post('/folders/', { name });
    return res.data;
  }

  async deleteFolder(folderId: number) {
    const res = await this.api.delete(`/folders/${folderId}/`);
    return res.data;
  }

  // 파일
  async getFilesByFolder(folderId: number) {
    const res = await this.api.get(`/folders/${folderId}/files/`);
    return res.data;
  }

  async getFile(fileId: number) {
    const res = await this.api.get(`/files/${fileId}/`);
    return res.data;
  }

  async createFile(folderId: number, name: string, file_type: string, invited_students: string[] = []) {
    const res = await this.api.post(`/folders/${folderId}/files/`, {
      name,
      file_type,
      invited_students,
    });
    return res.data;
  }

  async updateFileName(fileId: number, name: string) {
    const res = await this.api.put(`/files/${fileId}/update/`, { name });
    return res.data;
  }

  async deleteFile(fileId: number) {
    const res = await this.api.delete(`/files/${fileId}/delete/`);
    return res.data;
  }

  async inviteStudent(fileId: number, email: string) {
    const res = await this.api.post(`/files/${fileId}/invite`, { email });
    return res.data;
  }

  async getInvitedStudents(fileId: number) {
    const res = await this.api.get(`/files/${fileId}/invited_students`);
    return res.data;
  }

  // 셀
  async addCell(fileId: number, content: string) {
    const res = await this.api.post(`/files/${fileId}/cells/`, { content });
    return res.data;
  }

  async updateCell(cellId: number, content: string) {
    const res = await this.api.put(`/cells/${cellId}/update/`, { content });
    return res.data;
  }

  async deleteCell(cellId: number) {
    const res = await this.api.delete(`/cells/${cellId}/delete/`);
    return res.data;
  }

  async runCell(cellId: number) {
    const res = await this.api.post(`/cells/${cellId}/run/`);
    return res.data;
  }
}

export default new ApiClient();