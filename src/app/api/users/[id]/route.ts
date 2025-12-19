export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, email, role } = await req.json();
  if (!name || !email || !role) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { name, email, role },
    });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}
