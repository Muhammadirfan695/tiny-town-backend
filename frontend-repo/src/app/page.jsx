"use client";

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { FullPageLoader } from './components/common/Loader';


export default function HomePage() {
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

  // return (
  //   <div style={{
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       height: '100vh',
  //       backgroundColor: '#f9fafb',
  //       fontFamily: 'sans-serif'
  //   }}>
  //     <p>Loading...</p> 
  //   </div>
  // );
}