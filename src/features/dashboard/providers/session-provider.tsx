'use client';
import React, { createContext, useContext } from 'react';

type User = {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
};

type Session = {
  user: User;
  session: {
    id: string;
    expiresAt: Date;
    ipAddress?: string | null;
  };
} | null;

const SessionContext = createContext<Session>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}

export function useUser() {
  const session = useSessionContext();
  return session?.user;
}
export function useUserName() {
  const session = useSessionContext();
  return session?.user?.name;
}

export function useRole() {
  const session = useSessionContext();
  return session?.user?.role;
}
