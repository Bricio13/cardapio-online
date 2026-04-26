import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const restaurant = await prisma.restaurant.findFirst();
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Restaurant error:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados do restaurante' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const data = await request.json();
    const restaurant = await prisma.restaurant.update({
      where: { id: 'default' },
      data,
    });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar restaurante' }, { status: 500 });
  }
}
