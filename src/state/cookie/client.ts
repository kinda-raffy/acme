'use client';

export const useClientUserId = (): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; userId=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? '';
  }
  throw new Error('User not logged in');
};

export const setClientUserId = (userId: string): void => {
  document.cookie = `userId=${userId}; path=/`;
};
