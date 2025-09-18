import { useState } from "react";

function App() {
  const [data, setData] = useState(null);

  const fetchMyInfo = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/me/`,
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImhpcDAxOE9Mb1ZBMU5LeE4iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2Z4dGV0ZXlkZnhmcGZtYmplcHVwLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzNDc2OGVmOS05ZGYwLTRmN2MtYjhjMS0xMTkwYTc5Y2FhN2EiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4MjA1MTMwLCJpYXQiOjE3NTgyMDE1MzAsImVtYWlsIjoiaGVlcmEwMzM4QG5hdmVyLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJoZWVyYTAzMzhAbmF2ZXIuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiMzQ3NjhlZjktOWRmMC00ZjdjLWI4YzEtMTE5MGE3OWNhYTdhIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTgyMDE1MzB9XSwic2Vzc2lvbl9pZCI6IjI2NTdlMDA1LTFjZmEtNGQzZC1iZmI5LTJiNzZhNjkzODEwMyIsImlzX2Fub255bW91cyI6ZmFsc2V9.BVtaxYJs_zYqz95hP6Eg7Nrf2q-G25W8YwoloErWaLc",
        },
      }
    );

    const text = await response.text(); // JSON 실패해도 텍스트를 먼저 확인
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text }; // JSON이 아니면 원문 그대로
    }

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    setData(result);
  } catch (err) {
    setData({ error: err.message });
  }
};

  return (
    <div>
      <h1>프런트 ↔ 백엔드 연결 테스트</h1>
      <button onClick={fetchMyInfo}>내 정보 불러오기</button>
      <pre>{data ? JSON.stringify(data, null, 2) : "아직 없음"}</pre>
    </div>
  );
}

export default App;
