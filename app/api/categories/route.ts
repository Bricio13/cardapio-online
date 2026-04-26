import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { products: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { name, order } = await request.json();
    const category = await prisma.category.create({
      data: { name, order: parseInt(order) || 0 },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
