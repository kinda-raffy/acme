import {cookies} from 'next/headers';

export const useCurrentUserId = async (): Promise<string> => {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) {
    throw new Error('User not logged in');
  }
  return userId;
};
