import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSignupClick: () => void;
}

export function LoginPage({ onSignupClick }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setToken } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      const data = await api.login(email, password);
      setToken(data.access_token);
      api.setToken(data.access_token);

      // 사용자 정보 조회
      const userData = await api.getMe();
      setUser(userData);
    } catch (err) {
      setError('로그인 실패. 이메일과 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
        <p className="text-center text-gray-500 mb-6">Access your account</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-blue-50"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-blue-50"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
          >
            로그인
          </button>
          <button
            onClick={onSignupClick}
            className="w-full border border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}