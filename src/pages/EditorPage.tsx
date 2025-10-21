import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Play } from 'lucide-react';
import api from '../services/api';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { Cell, File as FileType } from '../types';
import { InviteModal } from '../components/InviteModal';

interface EditorPageProps {
  fileId: number;
  files: FileType[];
  onBack: () => void;
}

export function EditorPage({ fileId, files, onBack }: EditorPageProps) {
  const [fileDetail, setFileDetail] = useState<FileType | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [runningCells, setRunningCells] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    loadFile();
  }, [fileId]);

  const loadFile = async () => {
    try {
      setLoading(true);
      const data = await api.getFile(fileId);
      setFileDetail(data);
      setCells(data.cells || []);
    } catch (err) {
      console.error('파일 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const canEditFile = (): boolean => {
    if (!fileDetail || !user) return false;
    if (user.role === 'teacher') return true;
    if (user.role === 'student' && fileDetail.file_type === '학습용') return true;
    if (user.role === 'student' && fileDetail.file_type === '자습용') return true;
    return false;
  };

  const canAddCell = (): boolean => {
    return canEditFile();
  };

  const addCell = async () => {
    try {
      const newCell = await api.addCell(fileId, '# 코드를 입력하세요');  // 기본값
      setCells([...cells, newCell]);
    } catch (err) {
      console.error('셀 추가 실패:', err);
    }
  };

  const updateCellContent = (cellId: number, content: string) => {
    setCells(cells.map((c) => (c.id === cellId ? { ...c, content } : c)));
  };

  const saveAndRunCell = async (cellId: number) => {
    try {
      const cell = cells.find((c) => c.id === cellId);
      if (!cell) return;

      setRunningCells((prev) => new Set([...prev, cellId]));

      // 먼저 저장
      await api.updateCell(cellId, cell.content);

      // 실행
      const result = await api.runCell(cellId);
      setCells(cells.map((c) => (c.id === cellId ? result : c)));
    } catch (err) {
      console.error('셀 실행 실패:', err);
    } finally {
      setRunningCells((prev) => {
        const next = new Set(prev);
        next.delete(cellId);
        return next;
      });
    }
  };

  const deleteCell = async (cellId: number) => {
    if (!confirm('셀을 삭제하시겠습니까?')) return;
    try {
      await api.deleteCell(cellId);
      setCells(cells.filter((c) => c.id !== cellId));
    } catch (err) {
      console.error('셀 삭제 실패:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="로딩 중..." onBack={onBack} />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">파일 로드 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title={fileDetail?.name || '파일'} onBack={onBack} />

      {/* 상단 액션 바 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          파일 타입: <span className="font-semibold">{fileDetail?.file_type}</span>
        </div>
        {fileDetail?.file_type !== '교재용' && user?.role === 'teacher' && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            학생 초대
          </button>
        )}
      </div>

      {/* 셀 목록 */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {cells.map((cell, idx) => (
          <div key={cell.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* 셀 헤더 */}
            <div className="bg-gray-100 p-2 text-sm font-semibold text-gray-700 flex justify-between items-center">
              <span>셀 {idx + 1}</span>
              <span className="text-xs text-gray-500">{new Date(cell.created_at).toLocaleString()}</span>
            </div>

            {/* 셀 내용 */}
            <div className="p-4">
              <textarea
                value={cell.content}
                onChange={(e) => updateCellContent(cell.id, e.target.value)}
                disabled={!canEditFile()}
                className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={6}
                placeholder="코드를 입력하세요..."
              />

              {/* 액션 버튼 */}
              <div className="flex gap-2 mt-3">
                {canEditFile() && (
                  <>
                    <button
                      onClick={() => saveAndRunCell(cell.id)}
                      disabled={runningCells.has(cell.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play size={16} /> {runningCells.has(cell.id) ? '실행 중...' : '실행'}
                    </button>
                    <button
                      onClick={() => deleteCell(cell.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <Trash2 size={16} /> 삭제
                    </button>
                  </>
                )}
              </div>

              {/* 실행 결과 */}
              {cell.output && (
                <div className="mt-3 bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-auto max-h-40 whitespace-pre-wrap break-words">
                  {cell.output}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 셀 추가 버튼 */}
        {canAddCell() && (
          <button
            onClick={addCell}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} /> 셀 추가
          </button>
        )}
      </div>

      {/* 초대 모달 */}
      {showInviteModal && (
        <InviteModal
          fileId={fileId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            loadFile();
          }}
        />
      )}
    </div>
  );
}