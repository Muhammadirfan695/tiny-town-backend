"use client";

import { useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { FullPageLoader } from './components/common/Loader';

function HomeLogic() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) return;

    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, searchParams, router]);

  return <FullPageLoader />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <HomeLogic />
    </Suspense>
  );
}