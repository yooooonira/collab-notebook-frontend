import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { Folder } from '../types';

interface FoldersPageProps {
  onSelectFolder: (folderId: number) => void;
}

export function FoldersPage({ onSelectFolder }: FoldersPageProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const data = await api.getFolders();
      setFolders(data);
    } catch (err) {
      console.error('폴더 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await api.createFolder(newFolderName);
      setNewFolderName('');
      loadFolders();
    } catch (err) {
      console.error('폴더 생성 실패:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="수업 목록" />

      <div className="p-6">
        {user?.role === 'teacher' && (
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              placeholder="새 폴더명"
              className="flex-1 border border-gray-300 rounded-lg p-2"
            />
            <button
              onClick={createFolder}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> 폴더 생성
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : (
          <div className="space-y-3">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 transition"
              >
                <div className="font-semibold text-lg">{folder.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}