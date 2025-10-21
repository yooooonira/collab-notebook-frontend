import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { FoldersPage } from './pages/FoldersPage';
import { FilesPage } from './pages/FilesPage';
import { EditorPage } from './pages/EditorPage';
import { Folder, File as FileType } from './types';
import api from './services/api';

type PageType = 'login' | 'signup' | 'folders' | 'files' | 'editor';

export default function App() {
  const [page, setPage] = useState<PageType>('login');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const { token, setToken, setUser } = useAuth();

  useEffect(() => {
    if (token) {
      api.setToken(token);
      initializeUser();
    }
  }, [token]);

  const initializeUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      setPage('folders');
      loadFolders();
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
      setToken(null);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await api.getFolders();
      setFolders(data);
    } catch (err) {
      console.error('폴더 로드 실패:', err);
    }
  };

  const loadFiles = async (folderId: number) => {
    try {
      const data = await api.getFilesByFolder(folderId);
      setFiles(data);
    } catch (err) {
      console.error('파일 로드 실패:', err);
    }
  };

  const handleSelectFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
    loadFiles(folderId);
    setPage('files');
  };

  const handleSelectFile = (fileId: number) => {
    setSelectedFileId(fileId);
    setPage('editor');
  };

  const handleBackToFolders = () => {
    setSelectedFolderId(null);
    setSelectedFileId(null);
    setPage('folders');
  };

  const handleBackToFiles = () => {
    setSelectedFileId(null);
    setPage('files');
  };

  const handleSignupClick = () => {
    setPage('signup');
  };

  const handleBackToLogin = () => {
    setPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {page === 'login' && !token && <LoginPage onSignupClick={handleSignupClick} />}

      {page === 'signup' && !token && <SignupPage onBackClick={handleBackToLogin} />}

      {page === 'folders' && token && (
        <FoldersPage onSelectFolder={handleSelectFolder} />
      )}

      {page === 'files' && token && selectedFolderId && (
        <FilesPage
          folderId={selectedFolderId}
          folders={folders}
          onSelectFile={handleSelectFile}
          onBack={handleBackToFolders}
        />
      )}

      {page === 'editor' && token && selectedFileId && (
        <EditorPage
          fileId={selectedFileId}
          files={files}
          onBack={handleBackToFiles}
        />
      )}
    </div>
  );
}