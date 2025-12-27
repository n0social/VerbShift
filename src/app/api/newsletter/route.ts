import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CSV_PATH = path.resolve(process.cwd(), 'email_signupsheet.csv');

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }
    // Append to CSV (create file if not exists)
    const row = `${email},${new Date().toISOString()}\n`;
    await fs.appendFile(CSV_PATH, row, { encoding: 'utf8', flag: 'a' });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save email.' }, { status: 500 });
  }
}
