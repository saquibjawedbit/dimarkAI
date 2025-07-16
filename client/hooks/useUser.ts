import { useState, useEffect } from 'react';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            setError(null);
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data: User = await response.json();
                setUser(data);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading, error };
}