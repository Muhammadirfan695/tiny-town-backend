"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginWithTokenAction } from '@/redux/actions/authActions';

const AuthContext = createContext(null);

const getInitialUser = () => {
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('lunchfinder_user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                return null;
            }
        }
    }
    return null;
};

export function ProvideAuth({ children }) {
    const [user, setUser] = useState(getInitialUser);
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams(); 


    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            dispatch(loginWithTokenAction(token, router));
        }
    }, [searchParams, dispatch, router]);


    const logout = () => {
        localStorage.removeItem('lunchfinder_user');
        setUser(null);
        router.push('/login');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        logout, 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}