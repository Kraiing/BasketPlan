// components/LoginForm.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginForm({ onLogin }) {
  const translations = {
    th: {
      heading: "โครงการ BasketPlan",
      welcome: "ยินดีต้อนรับ!",
      instruction: "โปรดกรอกชื่อผู้ใช้และรหัสผ่านเพื่อเล่นเกมบาสเก็ตบอล",
      usernamePlaceholder: "ชื่อผู้ใช้ (admin)",
      passwordPlaceholder: "รหัสผ่าน",
      error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      loginButton: "เข้าสู่ระบบ",
    },
    en: {
      heading: "BasketPlan Project",
      welcome: "Welcome!",
      instruction: "Please enter your username and password to play the basketball game",
      usernamePlaceholder: "Username (admin)",
      passwordPlaceholder: "Password",
      error: "Invalid username or password",
      loginButton: "Login",
    },
    jp: {
      heading: "バスケットプラン 🏀",
      welcome: "ようこそ！",
      instruction: "ユーザー名とパスワードを入力してゲームを始めましょう",
      usernamePlaceholder: "ユーザー名 (admin)",
      passwordPlaceholder: "パスワード",
      error: "ユーザー名またはパスワードが正しくありません",
      loginButton: "ログイン",
    },
  };
// เพิ่มฟังก์ชัน handleSubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบการล็อกอิน
    if (username === 'admin' && password === '1234') {
      try {
        // เรียก API เพื่อบันทึกการล็อกอิน (ถ้ามี)
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          onLogin(username); // เรียก callback function เพื่อแจ้งสถานะการล็อกอิน
        } else {
          setError(translations[lang].error);
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(translations[lang].error);
      }
    } else {
      setError(translations[lang].error);
    }
  };
  // เปลี่ยนค่าเริ่มต้นเป็นภาษาญี่ปุ่น
  const [lang, setLang] = useState('jp');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ...handleSubmit code remains the same...

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-pink-50">
      <div className="p-8 bg-white rounded-3xl shadow-2xl w-96 transform hover:scale-[1.02] transition-all">
        <h2 className="text-4xl font-bold mb-2 text-indigo-600 text-center">
          {translations[lang].heading}
        </h2>
        <h3 className="text-2xl font-bold mb-4 text-pink-500 text-center">
          {translations[lang].welcome}
        </h3>
        <p className="mb-6 text-lg text-gray-600 text-center">
          {translations[lang].instruction}
        </p>

        {/* ปุ่มเปลี่ยนภาษาแบบใหม่ */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setLang('jp')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              lang === 'jp' 
                ? 'bg-indigo-500 text-white shadow-lg scale-110' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🇯🇵 JP
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              lang === 'en'
                ? 'bg-indigo-500 text-white shadow-lg scale-110'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => setLang('th')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              lang === 'th'
                ? 'bg-indigo-500 text-white shadow-lg scale-110'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🇹🇭 TH
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
        <input
  type="text"
  placeholder={translations[lang].usernamePlaceholder}
  className="w-full px-4 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-400 
             focus:outline-none text-lg transition-all
             text-gray-800 placeholder-gray-400" // เพิ่มสีตัวอักษรและ placeholder
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
<input
  type="password"
  placeholder={translations[lang].passwordPlaceholder}
  className="w-full px-4 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-400 
             focus:outline-none text-lg transition-all
             text-gray-800 placeholder-gray-400" // เพิ่มสีตัวอักษรและ placeholder
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
          {error && (
            <p className="text-red-500 font-medium text-center animate-bounce">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-bold 
                     hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg"
          >
            {translations[lang].loginButton}
          </button>
        </form>
      </div>
    </div>
  );
}