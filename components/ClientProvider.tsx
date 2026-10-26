'use client';

import React from 'react';
import { KlubiProvider } from '@/context/KlubiContext';

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <KlubiProvider>{children}</KlubiProvider>;
};
