import { Session } from '~/server/auth/session';
import React, { useContext, useEffect, useState } from 'react';
import { headerSchema, tokenSchema } from '~/server/auth/token-schema';

const SessionContext = React.createContext<Session>({ isAuthorised: false });
const SessionContextUpdater = React.createContext<() => void>(() => {});

export const useSession = () => {
  return useContext(SessionContext);
};

export const useSessionUpdater = () => {
  return useContext(SessionContextUpdater);
};

export const SessionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session>({ isAuthorised: false });

  useEffect(() => {
    const newSession = getSession();
    setSession(newSession);
    console.log('Set new session!', newSession);
  }, []);

  const updateSession = () => {
    const newSession = getSession();
    setSession(newSession);
    console.log('updated session!', newSession);
  };

  return (
    <SessionContext.Provider value={session}>
      <SessionContextUpdater.Provider value={updateSession}>
        {children}
      </SessionContextUpdater.Provider>
    </SessionContext.Provider>
  );
};

const getSession = (): Session => {
  if (typeof window === 'undefined') {
    throw new Error('useSession hook can only be used client-side');
  }
  const token = window.sessionStorage.getItem('token');
  if (!token) return { isAuthorised: false };

  const parsedToken = tokenSchema.safeParse(token);
  if (!parsedToken.success) return { isAuthorised: false };

  const [headerStringBase64] = parsedToken.data.split('.');
  const headerString = Buffer.from(headerStringBase64, 'base64').toString(
    'utf-8'
  );
  const header = headerSchema.safeParse(JSON.parse(headerString));
  if (!header.success) return { isAuthorised: false };
  return {
    user: header.data.usr,
    expiresAt: header.data.eat,
    isAuthorised: header.data.eat.getTime() > Date.now()
  };
};
