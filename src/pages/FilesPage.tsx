import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { File as FileType, Folder } from '../types';

interface FilesPageProps {
  folderId: number;
  folders: Folder[];
  onSelectFile: (fileId: number) => void;
  onBack: () => void;
}

export function FilesPage({ folderId, folders, onSelectFile, onBack }: FilesPageProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileType[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [fileType, setFileType] = useState<'교재용' | '학습용' | '자습용'>( user?.role === 'teacher' ? '학습용' : '자습용');
  const [loading, setLoading] = useState(true);
  

  const currentFolder = folders.find((f) => f.id === folderId);

  useEffect(() => {
    loadFiles();
  }, [folderId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await api.getFilesByFolder(folderId);
      setFiles(data);
    } catch (err) {
      console.error('파일 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFile = async () => {
    if (!newFileName.trim()) return;
    try {
      await api.createFile(folderId, newFileName, fileType);
      setNewFileName('');
      loadFiles();
    } catch (err) {
      console.error('파일 생성 실패:', err);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    try {
      await api.deleteFile(fileId);
      loadFiles();
    } catch (err) {
      console.error('파일 삭제 실패:', err);
    }
  };

  const canDeleteFile = (file: FileType) => {
    return file.created_by === user?.id;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title={currentFolder?.name || '파일 목록'} onBack={onBack} />

      <div className="p-6">
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createFile()}
            placeholder="새 파일명"
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as any)}
            className="border border-gray-300 rounded-lg p-2"
          >
            {user?.role === 'teacher' ? (
              <>
                <option>교재용</option>
                <option>학습용</option>
              </>
            ) : (
              <option>자습용</option>
            )}
          </select>
          <button
            onClick={createFile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> 파일 생성
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200"
              >
                <button
                  onClick={() => onSelectFile(file.id)}
                  className="flex-1 text-left font-semibold text-blue-600 hover:underline"
                >
                  {file.name} <span className="text-gray-500 text-sm ml-2">({file.file_type})</span>
                </button>
                {canDeleteFile(file) && (
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}