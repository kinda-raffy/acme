import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

type SessionState = {
  activeThreadId: string | null;
  activeThreadShouldAgentRespond: boolean;
};

type SessionActions = {
  setActiveThreadId: (activeThreadId: string | null) => void;
  setActiveThreadShouldAgentRespond: (
    activeThreadShouldAgentRespond: boolean
  ) => void;
};

type SessionStore = SessionState & SessionActions;

export const useSession = create<SessionStore>()(
  immer(set => ({
    activeThreadId: null,
    activeThreadShouldAgentRespond: false,
    setActiveThreadId: (activeThreadId: string | null) =>
      set(state => {
        state.activeThreadId = activeThreadId;
      }),
    setActiveThreadShouldAgentRespond: (
      activeThreadShouldAgentRespond: boolean
    ) =>
      set(state => {
        state.activeThreadShouldAgentRespond =
          activeThreadShouldAgentRespond;
      }),
  }))
);

export const useActiveThreadId = () => {
  return useSession(state => state.activeThreadId);
};

export const useActiveThreadShouldAgentRespond = () => {
  const activeThreadId = useActiveThreadId();
  const activeThreadShouldAgentRespond = useSession(
    state => state.activeThreadShouldAgentRespond
  );

  return activeThreadId && activeThreadShouldAgentRespond;
};
