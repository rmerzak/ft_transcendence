'use client';
import { isValidAccessToken } from '@/api/user/user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                isValidAccessToken().then((res) => {
                    if (res) {
                        setIsAuthenticated(true);
                    } else {
                        router.push('/auth/login');
                    }
                }).catch(() => {
                    router.push('/auth/login');
                });
            } catch {
                router.push('/auth/login');
            }
        }
        fetchData();
    }, []);

    if (isAuthenticated) {
        return <>{children}</>;
    }
    return null
};

export default AuthWrapper
