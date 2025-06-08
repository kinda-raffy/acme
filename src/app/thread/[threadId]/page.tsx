'use client';

import {use, useEffect} from 'react';
import {useSession} from '~/state/session';
import {HomePage} from '~/components/home';

type PageProps = {
  params: Promise<{
    threadId: string;
  }>;
};

export default function Page({params}: PageProps) {
  const {threadId} = use(params);
  const setActiveThreadId = useSession(s => s.setActiveThreadId);

  if (!threadId) {
    window.location.href = '/';
  }

  useEffect(() => {
    setActiveThreadId(threadId);
  }, [threadId, setActiveThreadId]);

  return <HomePage />;
}
