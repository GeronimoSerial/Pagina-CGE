'use server';

import { auth } from '@/shared/lib/auth/auth';
import { headers } from 'next/headers';
import { prisma } from '../lib/prisma';

export async function createUser(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // @ts-ignore
  const currentUserRole = session?.user?.role;

  if (currentUserRole !== 'owner') {
    return { error: 'Unauthorized' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;

  if (!email || !password || !name || !role) {
    return { error: 'Missing fields' };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        // @ts-ignore
        role,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { error: error.body?.message || 'Failed to create user' };
  }
}

export async function getUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // @ts-ignore
  if (session?.user?.role !== 'owner') {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // @ts-ignore
  if (session?.user?.role !== 'owner') {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user' };
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // @ts-ignore
  if (session?.user?.role !== 'owner') {
    return { error: 'Unauthorized' };
  }

  try {
    // Import dynamically to avoid build issues if types are missing
    const { hashPassword } = await import('better-auth/crypto');
    const hashedPassword = await hashPassword(newPassword);

    // Update password in the account table where provider is 'credential' (or just update any account with password)
    // Better-auth usually uses 'credential' for email/password
    await prisma.account.updateMany({
      where: {
        userId: userId,
        providerId: 'credential',
      },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating password:', error);
    return { error: 'Failed to update password' };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // @ts-ignore
  if (session?.user?.role !== 'owner') {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating role:', error);
    return { error: 'Failed to update role' };
  }
}
