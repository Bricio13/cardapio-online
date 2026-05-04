import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { customerName, customerPhone, address, paymentMethod, observations, items, total } = await request.json();

    // 1. Validar se todos os produtos existem antes de criar
    const productIds = items.map((item: any) => item.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    });

    const existingIds = existingProducts.map(p => p.id);
    const missingIds = productIds.filter((id: string) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      return NextResponse.json({ 
        error: 'Produtos Inválidos', 
        details: 'Alguns itens no seu carrinho não existem mais no nosso sistema. Por favor, remova os itens atuais e adicione-os novamente do menu.' 
      }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        paymentMethod,
        observations,
        total: parseFloat(total),
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    console.log('Pedido criado com sucesso:', order.id);
    return NextResponse.json(order);
  } catch (error) {
    console.error('DETALHES DO ERRO AO CRIAR PEDIDO:', error);
    
    let message = 'Erro ao criar pedido';
    let details = 'Erro desconhecido';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        message = 'Erro de integridade';
        details = 'Um ou mais produtos no seu carrinho não existem mais no sistema. Por favor, limpe o carrinho e adicione-os novamente.';
      } else {
        details = `Erro Prisma (${error.code})`;
      }
    } else if (error instanceof Error) {
      details = error.message;
    }

    return NextResponse.json({ error: message, details }, { status: 500 });
  }
}
