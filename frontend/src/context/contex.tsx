'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

import { User } from '@/interfaces';

export const ContextGlobal = createContext({
  setProfile() {},
  profile: null
});

export const ContextProvider = ({ children }: { children: any }) => {
  const [profile, setProfile] = useState<User | null>({
    id: -1,
    email: '',
    firstname: '',
    lastname: '',
    username: '',
    image: '/avatar.jpeg',
    isVerified: false,
    twoFactorSecret: '',
    twoFactorEnabled: false,
    
  });

    return <ContextGlobal.Provider value={{
      profile,
      setProfile
  } } > {children} </ContextGlobal.Provider>;
};