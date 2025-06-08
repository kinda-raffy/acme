import {create} from 'zustand/react';

type Session = {
  activeThreadId: string | null;
  setActiveThreadId: (activeThreadId: string | null) => void;
};

export const useSession = create<Session>(set => ({
  activeThreadId: null,
  setActiveThreadId: (activeThreadId: string | null) =>
    set({activeThreadId}),
}));

export const useActiveThreadId = () => {
  return useSession(state => state.activeThreadId);
};
