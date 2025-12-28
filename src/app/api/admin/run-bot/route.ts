import { NextResponse } from 'next/server';
import { runBotGuideGenerator } from '@/lib/botGuideGenerator';

export async function POST() {
  const result = await runBotGuideGenerator();
  return NextResponse.json(result);
}
