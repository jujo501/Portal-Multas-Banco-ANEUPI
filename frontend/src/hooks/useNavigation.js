import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useCallback((path) => {
    window.location.href = path;
  }, []);

  return { navigate };
};
