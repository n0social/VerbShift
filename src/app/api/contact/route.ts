import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  // TODO: Integrate with a real email service (e.g., Nodemailer, Resend, SendGrid)
  // For now, just log the message (for development)
  console.log('Contact form submission:', { name, email, message });

  // Simulate success
  return NextResponse.json({ success: true });
}
