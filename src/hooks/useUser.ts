import { getUserById } from '@/firebase/api';
import { useEffect, useState } from 'react';

const useUser = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    userId && fetchUserById(userId);
  }, [userId]);

  const fetchUserById = async (userId: string) => {
    setLoading(true);

    try {
      const user = await getUserById(userId);
      setUser(user);
    } catch (e: any) {
      console.log('fetchUser error :>> ', e.message);
    }

    setLoading(false);
  };

  return { loading, error, user };
};

export default useUser;
