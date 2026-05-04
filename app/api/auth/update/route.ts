import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  const userPayload = await getAuthUser();
  if (!userPayload || !userPayload.userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { currentPassword, newEmail, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId as string },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
    }

    const updateData: any = {};
    if (newEmail && newEmail !== user.email) {
      // Verificar se o novo email já está em uso
      const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
      if (existingUser) {
        return NextResponse.json({ error: 'Este e-mail já está em uso' }, { status: 400 });
      }
      updateData.email = newEmail;
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhuma alteração fornecida' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: 'Dados atualizados com sucesso' });
  } catch (error) {
    console.error('Update auth error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar dados de acesso' }, { status: 500 });
  }
}
