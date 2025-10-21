import React, { useState } from 'react';
import api from '../services/api';

interface InviteModalProps {
  fileId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteModal({ fileId, onClose, onSuccess }: InviteModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setError('이메일을 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.inviteStudent(fileId, inviteEmail);
      alert('학생을 초대했습니다!');
      onSuccess();
    } catch (err) {
      setError('초대 실패. 다시 시도하세요.');
      console.error('초대 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">학생 초대</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
          placeholder="학생 이메일"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={handleInvite}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? '초대 중...' : '초대'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}