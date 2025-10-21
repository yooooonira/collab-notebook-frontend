import React, { useState } from 'react';
import api from '../services/api';
import { UserRole } from '../types';

interface SignupPageProps {
  onBackClick: () => void;
}

export function SignupPage({ onBackClick }: SignupPageProps) {
  const [step, setStep] = useState<'credentials' | 'role'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }
    setError('');
    setStep('role');
  };

  const handleSignup = async (selectedRole: UserRole) => {
  try {
    setLoading(true);
    setError('');

    // Supabase 회원가입
    const signupData = await api.signup(email, password);
    
    // 디버깅: 응답 확인
    console.log('Supabase Response:', signupData);

    // 백엔드에 사용자 등록
    await api.registerUser(signupData.user.id, email, selectedRole);

    alert('회원가입 완료! 로그인하세요.');
    onBackClick();
  } catch (err) {
    console.error('회원가입 에러:', err);
    setError('회원가입 실패. 다시 시도하세요.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {step === 'credentials' ? (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-blue-50"
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
              onClick={handleNextStep}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
            >
              다음
            </button>
            <button
              onClick={onBackClick}
              className="w-full border border-gray-300 text-gray-600 font-semibold py-3 rounded-lg"
            >
              뒤로
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center font-semibold mb-6">역할을 선택하세요</p>
            <button
              onClick={() => handleSignup('teacher')}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
            >
              선생님
            </button>
            <button
              onClick={() => handleSignup('student')}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
            >
              학생
            </button>
            <button
              onClick={() => { setStep('credentials'); setError(''); }}
              className="w-full border border-gray-300 text-gray-600 font-semibold py-3 rounded-lg"
            >
              뒤로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
