import React from 'react';
import {
  useCallback,
  useMemo,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from 'react-query';

import {SERVICE} from '../../services/services';
import queryClient from '../../configs/reactQuery';
import {AUTH_KEY} from '../../constants/storageKeys';

const AuthContext = createContext({
  user: {isAuthenticated: false},
  login: () => undefined,
  logout: () => undefined,
});

function AuthProvider({children}) {
  const [user, setUser] = useState({
    isAuthenticated: false,
  });

  //TODO: Fix read data from AsyncStorage
  useEffect(() => {
    async function fetchAsyncStorage() {
      const asycnStorage = await AsyncStorage.getItem(AUTH_KEY);
      if (asycnStorage) {
        const loginValues = await AsyncStorage.getItem(AUTH_KEY);
        setUser({
          ...loginValues,
          isAuthenticated: true,
        });
      }
    }
    fetchAsyncStorage();
  }, [setUser]);

  // const {refetch} = useQuery(
  //   'getUserInfo',
  //   () =>
  //     SERVICE.userInfo(
  //       JSON.stringify({
  //         userId: 'me',
  //       }),
  //     ),
  //   {
  //     enabled: false,
  //     onSuccess({data}) {
  //       const userInformations = data?.user;
  //       if (userInformations) {
  //         AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userInformations));
  //         setUser({
  //           ...userInformations,
  //           isAuthenticated: true,
  //         });
  //       }
  //     },
  //   },
  // );

  const refetch = async () => {
    console.log('refetch');
    userInformations = {
      id: 1234,
      name: 'onur',
      surname: 'avci',
      email: 'onurcannavci@gmail.com',
    };
    //TODO: Fix write data to AsyncStorage
    if (userInformations) {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userInformations));
      setUser({
        ...userInformations,
        isAuthenticated: true,
      });
    }
  };

  const login = useCallback(() => {
    refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    queryClient.clear();
    setUser({isAuthenticated: false});
  }, [setUser]);

  const value = useMemo(() => ({user, login, logout}), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export {AuthProvider, useAuth};
