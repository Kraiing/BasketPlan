'use client';

import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  // กำหนดข้อความสำหรับแต่ละภาษา
  const translations = {
    th: {
      heading: "โครงการ BasketPlan",
      welcome: "ยินดีต้อนรับ!",
      instruction: "โปรดกรอกชื่อผู้ใช้และรหัสผ่านเพื่อเล่นเกมบาสเก็ตบอล",
      usernamePlaceholder: "ชื่อผู้ใช้ (admin)",
      passwordPlaceholder: "รหัสผ่าน (1234)",
      error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      loginButton: "เข้าสู่ระบบ",
    },
    en: {
      heading: "BasketPlan Project",
      welcome: "Welcome!",
      instruction: "Please enter your username and password to play the basketball game",
      usernamePlaceholder: "Username (admin)",
      passwordPlaceholder: "Password (1234)",
      error: "Invalid username or password",
      loginButton: "Login",
    },
    jp: {
      heading: "バスケットプランプロジェクト",
      welcome: "ようこそ！",
      instruction: "バスケットボールゲームをプレイするためにユーザー名とパスワードを入力してください",
      usernamePlaceholder: "ユーザー名 (admin)",
      passwordPlaceholder: "パスワード (1234)",
      error: "ユーザー名またはパスワードが正しくありません",
      loginButton: "ログイン",
    },
  };

  // state สำหรับภาษา
  const [lang, setLang] = useState('th');

  // state สำหรับจัดการ username, password, error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตัวอย่างเงื่อนไขล็อกอินแบบง่าย: admin / 1234
    if (username === 'admin' && password === '1234') {
      try {
        // เรียก API เพื่อบันทึกเหตุการณ์ล็อกอิน
        await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            timestamp: new Date().toISOString(),
          }),
        });
        onLogin(username); // เรียก callback เปลี่ยนสถานะการล็อกอิน
      } catch (err) {
        console.error('API error:', err);
      }
    } else {
      setError(translations[lang].error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF4B7]">
      <h2 className="text-3xl font-bold mb-2 text-[#FF6B6B]">
        {translations[lang].heading}
      </h2>
      <h3 className="text-2xl font-bold mb-4 text-[#FF6B6B]">
        {translations[lang].welcome}
      </h3>
      <p className="mb-6 text-lg text-gray-800">
        {translations[lang].instruction}
      </p>

      {/* ปุ่มเปลี่ยนภาษา */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setLang('th')}
          className={`px-3 py-1 rounded ${
            lang === 'th' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          TH
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded ${
            lang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('jp')}
          className={`px-3 py-1 rounded ${
            lang === 'jp' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          JP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder={translations[lang].usernamePlaceholder}
          className="border-2 border-blue-300 p-3 rounded text-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder={translations[lang].passwordPlaceholder}
          className="border-2 border-blue-300 p-3 rounded text-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-600 transition-colors"
        >
          {translations[lang].loginButton}
        </button>
      </form>
    </div>
  );
}
