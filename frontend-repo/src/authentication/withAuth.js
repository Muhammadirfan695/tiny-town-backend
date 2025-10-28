"use client";

import { useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { useRouter, usePathname } from 'next/navigation';

// Aap yahan ek loader component bhi import kar sakte hain
// import { Loader } from '@/components/common/Loader';

const withAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (user === undefined) {
          return;
      }
      
      if (!isAuthenticated && pathname !== '/login' && !pathname.startsWith('/forgot-password') && !pathname.startsWith('/reset-password')) {
        router.replace('/login');
      }
      
      if (isAuthenticated && pathname === '/login') {
        router.replace('/dashboard');
      }
      
    }, [isAuthenticated, user, router, pathname]);

    if (!isAuthenticated && pathname !== '/login' && !pathname.startsWith('/forgot-password') && !pathname.startsWith('/reset-password')) {
      return null; 
    }
    
    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;