// app/api/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, timestamp } = await request.json();
  // ในที่นี้เราจะ log ลง console
  // ในการใช้งานจริง ควรบันทึกข้อมูลลงฐานข้อมูลหรือระบบ log ที่ปลอดภัย
  console.log(`User ${username} logged in at ${timestamp}`);
  return NextResponse.json({ message: 'Login event logged' });
}
